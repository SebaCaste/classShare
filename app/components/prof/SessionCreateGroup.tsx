import React, {useEffect, useState} from 'react';
import ApiService from "../../service/ApiService";
import {SessionStates} from "./HomeProf";

export default function SessionCreateGroup ({session, onSessionChange}) {

  const [studentsList, setStudentList] = useState(ApiService.studentsList);
  const [isStartingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    ApiService.on('studentJoined', () => {
      console.log('onStudentJoins')
      setStudentList([...ApiService.studentsList]);
    });

    return () => {
      ApiService.unscribe('studentJoined');
    }
  });

  async function startSession () {
    setIsCreatingSession(true);
    await ApiService.startSession(getGroups(), 'https://www.google.com'); // TODO: groups
    setIsCreatingSession(false);
    onSessionChange({
      ...session,
      state: SessionStates.STARTED
    })
  }

  function getGroups() {
    return [
      {
        id: 'awawa',
        students: studentsList
      }
    ]
  }

  return (
    <div>
      <p>LISTA STUDENTI</p>
      <ul>
        {
          studentsList.map(student => (
            <li>{student.fullname}</li>
          ))
        }
      </ul>

      <button onClick={startSession}>AVVIA</button>
    </div>
  )
}
