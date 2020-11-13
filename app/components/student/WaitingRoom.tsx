import React, {useEffect, useState} from 'react';
import ApiService from "../../service/ApiService";
import {StudentSessionStates} from "./HomeStudent";

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../../logo.png';
import style from '../../css/style.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {theme} from "../theme";

export default function WaitingRoom ({studentSession, onStudentSessionChanged}) {

  useEffect(() => {
    ApiService.on('startSession', (startMsg) => {
      onStudentSessionChanged({
        ...studentSession,
        state: StudentSessionStates.STARTED,
        startMsg
      });
    });
    return () => ApiService.unscribe('startSession');
  });

  return (
    <ThemeProvider theme={theme}>
            <img src={logo} className={style.centro} width="80%"/>
            <br/>
            <Paper className={style.paper} elevation={3}>
              <div className={style.title} ><h3>Waiting....</h3></div>
              <CircularProgress />
            </Paper>
            </ThemeProvider>
  );
}
