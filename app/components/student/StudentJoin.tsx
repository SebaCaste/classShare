import React, {useState} from 'react';
import ApiService from "../../service/ApiService";
import {handleInputChange} from "../utils";
import {StudentSessionStates} from "./HomeStudent";

export default function StudentJoin ({studentSession, onStudentSessionChanged}) {

  const [fullname, setFullname] = useState('');
  const [sessionId, setSessionId] = useState('');


  function joinSession () {
    ApiService.joinSessionAsStudent(sessionId, fullname);
    onStudentSessionChanged({
      ...studentSession,
      fullname,
      sessionId,
      state: StudentSessionStates.WAITING
    });
  }

  return (
    <div>
      <p>student</p>

      Nome
      <input type="text" onChange={handleInputChange(setFullname)} value={fullname}/>
      <br/>

      Codice
      <input type="text" onChange={handleInputChange(setSessionId)} value={sessionId}/>



      <button onClick={joinSession}>Entra</button>
    </div>
  );
}
