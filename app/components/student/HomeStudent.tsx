import React, {useState} from 'react';
import {handleInputChange} from "../utils";
import ApiService from "../../service/ApiService";
import StudentJoin from "./StudentJoin";
import WaitingRoom from "./WaitingRoom";
import StudentSession from "./StudentSession";

export const StudentSessionStates = {
  NOT_JOINED: 'not-joined',
  WAITING: 'waiting',
  STARTED: 'started'
}

export default function HomeStudent(){

  const [studentSession, setStudentSession] = useState({
    state: StudentSessionStates.NOT_JOINED,
    fullname: '',
    sessionId: null
  });

  switch (studentSession.state) {
    case StudentSessionStates.NOT_JOINED:
      return (
        <StudentJoin studentSession={studentSession} onStudentSessionChanged={setStudentSession}/>
      );

    case StudentSessionStates.WAITING:
      return (
        <WaitingRoom studentSession={studentSession} onStudentSessionChanged={setStudentSession}/>
      );

    case StudentSessionStates.STARTED:
      return (
        <StudentSession studentSession={studentSession} onStudentSessionChanged={setStudentSession}/>
      );
  }
}
