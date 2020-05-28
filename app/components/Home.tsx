import React, {useState} from 'react';
import {Link} from "react-router-dom";
import routes from '../constants/routes.json';
import ApiService from '../service/ApiService';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../repo/logo.jpg';
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
      <img src={logo} className={style.centro}/>
      <br/>
      <Paper className={style.paper} elevation={3} style={{borderRadius: '20px'}}>
        <div className={style.title}><h3>Accedi ad una sessione</h3></div>
        <Link to={routes.HOME_PROF} onClick={() => ApiService.initAsProf()} style={{opacity: 1}}>
          <div className={style.bottone}>
            <Button className={style.bottoneInner} variant="contained" color="primary" style={{color: 'black', width: '10em'}}>
              Professore
            </Button></div>
        </Link>
        <br/>
        <Link to={routes.HOME_STUDENT} onClick={() => ApiService.initAsStudent()} style={{opacity: 1}}>
          <div className={style.bottone}>
            <Button className={style.bottoneInner} variant="contained" color="primary" style={{color: 'black', width: '10em'}}>
              Studente
            </Button>
          </div>
        </Link>

      </Paper>
    </ThemeProvider>
  );
}
