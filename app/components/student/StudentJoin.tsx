import React, {useState} from 'react';
import ApiService from "../../service/ApiService";
import {handleInputChange} from "../utils";
import {StudentSessionStates} from "./HomeStudent";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../../../logo.png';
import style from '../../css/style.css';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import {theme} from "../theme";

export default function StudentJoin({studentSession, onStudentSessionChanged}) {

  const [fullname, setFullname] = useState('');
  const [sessionId, setSessionId] = useState('');


  function joinSession() {
    ApiService.joinSessionAsStudent(sessionId, fullname);
    onStudentSessionChanged({
      ...studentSession,
      fullname,
      sessionId,
      state: StudentSessionStates.WAITING
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <img src={logo} className={style.centro} width="80%"/>
      <br/>
      <Paper className={style.paper} elevation={3}  style={{borderRadius: '20px'}}>

        {/* <p>student</p> */}
        <div className={style.title}><h3>Inserisci il tuo nome</h3></div>
        <TextField
          id="standard-multiline-flexible"
          label="Nick name"
          multiline
          rowsMax={4}
          value={fullname}
          onChange={handleInputChange(setFullname)}
          className={style.input}
        />
        {/* <input type="text" onChange={handleInputChange(setFullname)} value={fullname}/> */}
        <br/>

        <div className={style.title}><h3>Inserisci codice sessione</h3></div>
        <TextField
          id="standard-multiline-flexible"
          label="Code"
          multiline
          rowsMax={4}
          value={sessionId}
          onChange={handleInputChange(setSessionId)}
          className={style.input}
        />
        {/* <input type="text" onChange={handleInputChange(setSessionId)} value={sessionId}/> */}
        <br/>
        <br/>
        <div className={style.bottone}>
          <Button onClick={joinSession} variant="contained" color="primary">
            Join
          </Button>
        </div>
      </Paper>
    </ThemeProvider>
  );
}
