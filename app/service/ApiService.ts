import io from 'socket.io-client';
import {v4 as uuidv4} from 'uuid';
import {ipcRenderer} from 'electron';
import StreamingService from './StreamingService';

const SERVER_URL = process.env.SERVER_URL || 'http://746ae0afe13e.ngrok.io';

class ApiService {

  socket;
  studentsList = [];
  _callbacks = {};
  _group = null;

  constructor() {
    this.socket = io(SERVER_URL);
    StreamingService.setSocket(this.socket);
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
    this.socket.on('startSession', async (startMsg) => {
      this._group = findMyGroup(startMsg.groups, this.socket.id);

      if(this.isHost()) {
        console.log('setting up as host');
        await StreamingService.setupAsHost(this._group.callUrl, startMsg.simulatorUrl);
      } else {
        console.log('setting up as guest');
        await StreamingService.setupAsGuest(this._group.students[0], this._group.callUrl);
      }

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
    const sessionId = uuidv4().substr(0, 4);
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
      group.callUrl = "https://meet.jit.si/squiddy";
    }
    return groups;
  }

  // STREAMING

  isHost() {
    return this._group.students.map(s => s.studentId).indexOf(this.socket.id) == 0;
  }

}

function findMyGroup(groups, id) {
  for (let group of groups) {
    if (group.students.map(s => s.studentId).indexOf(id) >= 0) {
      return group;
    }
  }
  throw new Error('group not found');
}

const instance = new ApiService();
export default instance;
