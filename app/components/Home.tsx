import React, {useState} from 'react';
import {Link} from "react-router-dom";
import routes from '../constants/routes.json';
import ApiService from '../service/ApiService';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import logo from '../../logo.png';
import style from '../css/style.css';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#F49561',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#999999',
    },
  },
});

export default function Home() {
  return (

    <ThemeProvider theme={theme}>
      <img src={logo} className={style.centro} width="80%"/>
      <br/>
      <Paper className={style.paper} elevation={3} style={{borderRadius: '20px'}}>
        <div className={style.title}><h3>Join a learning session</h3></div>
        <Link to={routes.HOME_PROF} onClick={() => ApiService.initAsProf()} style={{opacity: 1}}>
          <div className={style.bottone}>
            <Button className={style.bottoneInner} variant="contained" color="primary" style={{color: 'black', width: '10em'}}>
              Teacher
            </Button></div>
        </Link>
        <br/>
        <Link to={routes.HOME_STUDENT} onClick={() => ApiService.initAsStudent()} style={{opacity: 1}}>
          <div className={style.bottone}>
            <Button className={style.bottoneInner} variant="contained" color="primary" style={{color: 'black', width: '10em'}}>
              Student
            </Button>
          </div>
        </Link>

      </Paper>
    </ThemeProvider>
  );
}
