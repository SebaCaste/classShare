import React, {useEffect, useState} from 'react';
import ApiService from "../../service/ApiService";
import {SessionStates} from "./HomeProf";


import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import logo from '../../repo/logo.jpg';
import style from '../../css/style.css';
import {ThemeProvider} from '@material-ui/styles';
import {theme} from "../theme";

export default function SessionCreateGroup({session, onSessionChange}) {

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

  async function startSession() {
    setIsCreatingSession(true);
    await ApiService.startSession(getGroups(), 'https://www.tinkercad.com/dashboard'); // TODO: groups
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
    <div className={style.container}>
      <ThemeProvider theme={theme}>
        <img src={logo} className={style.centro}/>
        <br/>
        <Paper className={style.paper} elevation={3}  style={{borderRadius: '20px'}}>
          <div className={style.title}><h3>LISTA STUDENTI</h3></div>
          <ul>
            {
              studentsList.map(student => (
                <li key={student.fullname}>{student.fullname}</li>
              ))
            }
          </ul>
          <div className={style.bottone}>
            <Button onClick={startSession} variant="contained" color="primary">
              AVVIA
            </Button>
          </div>
        </Paper>
      </ThemeProvider>
    </div>
  )
}
