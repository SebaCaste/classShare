import {desktopCapturer, ipcRenderer} from 'electron';

const webRtcConfig = {
  'iceServers': [
    {
      urls: [
        'stun:stun.nextcloud.com:443'
      ]
    }
    {
      urls: [
        'stun:cloud.simonedegiacomi.dev:3478?transport=udp'
      ],
      credential: '<put key here>'
    }
  ]
};
console.log(webRtcConfig)
window.webRtcConfig = webRtcConfig;


const checkTURNServer = (turnConfig, timeout = 15000) => {
  console.log('checkTURNServer turnConfig', turnConfig);
  return new Promise(async (resolve, reject) => {
    const pc = new RTCPeerConnection({iceServers: [turnConfig]});
    let promiseResolved = false;
    // Stop waiting after X milliseconds and display the result
    setTimeout(() => {
      if (promiseResolved)
        return;
      promiseResolved = true;
      resolve(false);
    }, timeout);
    // Create a bogus data channel
    pc.createDataChannel('');
    // Listen for candidates
    pc.onicecandidate = ice => {
      if (promiseResolved || ice === null || ice.candidate === null)
        return;
      console.log('Got ice candidate', ice.candidate);
      if (ice.candidate.type === 'relay') {
        promiseResolved = true;
        resolve(true);
      }
    };
    // Create offer and set local description
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  });
};
window.checkTURNServer = checkTURNServer;

window.doCheck = () => {
  console.log('checking if TURN works...');
  checkTURNServer(webRtcConfig.iceServers[0])
    .then(active => {
      if (active) {
        console.log('it works!');
      } else {
        console.log('TURN not working...');
      }
    })
    .catch(console.error);
};

class StreamingService {

  setSocket(socket) {
    this.socket = socket;
    this.remoteStream = new MediaStream();
  }

  async setupAsHost(callUrl, simulatorUrl) {
    ipcRenderer.send('host_sessionStarted', callUrl, simulatorUrl);
    const stream = await this.getVideoStream();
    this.handleIncomingOffersFromGuests(stream);
    this.handleIncomingInputs();
  }

  async getVideoStream() {
    function findWindow() {
      return new Promise((resolve, reject) => {
        desktopCapturer.getSources({types: ['window']}).then(async sources => {
          for (const source of sources) {
            if (source.name.indexOf("hostBrowser") >= 0) {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: {
                    mandatory: {
                      chromeMediaSource: 'desktop',
                      chromeMediaSourceId: source.id,
                      /*minWidth: 2560,
                      maxWidth: 2560,
                      minHeight: 1440,
                      maxHeight: 1440*/
                    }
                  }
                })
                resolve(stream);
              } catch (e) {
                reject();
              }
              return;
            }
          }
          reject();
        });
      });
    }

    while (true) {
      try {
        return await findWindow();
      } catch (e) {
        console.log('window not found');
        await delay(500);
      }
    }
  }

  handleIncomingOffersFromGuests(stream) {
    const peerConnections = {};

    // handle incoming offers from guests
    this.socket.on('iceOfferFromGuest', async ({guestId, offer}) => {
      console.log('using webrtc config', webRtcConfig);
      const peerConnection = peerConnections[guestId] = new RTCPeerConnection(webRtcConfig);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('got offer from guest');

      // add track
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
        console.log('track added');
      });

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // send back answer
      this.socket.emit('iceAnswerFromHost', {
        guestId,
        answer
      });
      console.log('sent answer to guest from host')


      // send ice candidates to guest
      peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
          this.socket.emit('iceCandidate', {
            to: guestId,
            candidate: event.candidate
          })
          console.log('sent new ice candidate');
        }
      });

      // handle connection
      peerConnection.addEventListener('connectionstatechange', event => {
        console.log(event);
        if (peerConnection.connectionState === 'connected') {
          console.log('new guest connected!');
        }
      });
    });

    // handle incoming ice candidates from guests
    this.socket.on('iceCandidate', async ({from, candidate}) => {
      console.log(`got ice candidate from guest ${from}`);
      const peerConnection = peerConnections[from];
      await peerConnection.addIceCandidate(candidate);
    });
  }

  async setupAsGuest(host, callUrl) {
    ipcRenderer.send('guest_sessionStarted', callUrl);
    await this.connectToHost(host);
  }

  async connectToHost(host) {
    const hostId = host.studentId;
    const peerConnection = new RTCPeerConnection(webRtcConfig);
    const offer = await peerConnection.createOffer({ // this shouldn't be needed
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': true
    });
    await peerConnection.setLocalDescription(offer);

    // send offer to host
    const intervalId = setInterval(() => {
      this.socket.emit('iceOfferFromGuest', {
        hostId,
        offer
      });
    }, 2000);

    // handle incoming answer from host
    this.socket.on('iceAnswerFromHost', async (answer) => {
      clearInterval(intervalId);
      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.setRemoteDescription(remoteDesc);
      console.log('got ice answer from host');
    })

    // handle incoming ice candidates from host
    this.socket.on('iceCandidate', ({candidate}) => {
      console.log('got ice candidate from host')
      peerConnection.addIceCandidate(candidate);
    });

    // send ice candidates to host
    peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate) {
        this.socket.emit('iceCandidate', {
          to: hostId,
          candidate: event.candidate
        })
        console.log('sent new ice candidate');
      }
    });

    // handle connection
    peerConnection.addEventListener('connectionstatechange', event => {
      console.log(event);
      if (peerConnection.connectionState === 'connected') {
        console.log('connected to host!');
      }
    });


    // handle incoming stream
    return new Promise(resolve => {
      peerConnection.addEventListener('track', async (event) => {
        console.log('got new track');


        this.remoteStream.addTrack(event.track);
        resolve(this.remoteStream);
      });
    });
  }

  sendInput(input) {
    this.socket.emit('input', input);
  }

  handleIncomingInputs() {
    this.socket.on('input', msg => {
      ipcRenderer.send('host_inputFromGuest', msg)
    });
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const instance = new StreamingService();
export default instance;
