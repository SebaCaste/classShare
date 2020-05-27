import io from 'socket.io-client';
import {v4 as uuidv4} from 'uuid';

const SERVER_URL = 'http://4b496a39.ngrok.io';

class ApiService {

  socket;
  studentsList = [];
  _callbacks = {};

  constructor() {
    this.socket = io(SERVER_URL);
  }

  generateId() {
    return 'aa'
  }


  initAsProf() {
    this.socket.emit('role', 'prof');
    this.socket.on('studentJoined', (student) => {
      this.studentsList.push(student);
      if (this._callbacks['studentJoined'] != null) {
        this._callbacks['studentJoined']();
      }
    })
  }

  initAsStudent() {
    this.socket.emit('role', 'student');
    this.socket.on('startSession', (startMsg) => {
      this._callbacks['startSession'](startMsg);
    });
  }

  // USER MANAGMENT

  /**
   * asynchronously return a string, representing the session
   * MUST BE CALLED BY PROF
   * @param sessionName
   * @returns {Promise<string>}
   */
  async createSessionAsProf(sessionName) {
    const sessionId = uuidv4();
    this.socket.emit('createSession', {
      sessionName,
      sessionId
    });
    return sessionId;
  }

  /**
   * asynchrounsly joins a session.
   * it return true if everything went okay, false if error
   * MUST BE CALLED BY STUDENT
   * @param sessionId
   * @param fullname
   * @returns {Promise<void>}
   */
  async joinSessionAsStudent(sessionId, fullname) {
    this.socket.emit('joinSession', {
      sessionId,
      fullname
    })
  }

  on(name, callback) {
    this._callbacks[name] = callback;
  }

  unscribe(name) {
    this._callbacks[name] = null;
  }


  async startSession(groups, simulatorUrl) {
    this.socket.emit('startSession', {
      simulatorUrl,
      groups: this.addCallToGroups(groups)
    });
  }

  addCallToGroups (groups) {
    for (let group of groups) {
      console.log(group)
      group.callUrl = "https://meet.google.com/trm-rtvx-ivy";
    }
    return groups;
  }

  // STREAMING

}

const instance = new ApiService();
export default instance;
