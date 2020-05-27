import React, {useState, Fragment} from 'react';
import {handleInputChange} from "../utils";
import ApiService from "../../service/ApiService";
import {SessionStates} from "./HomeProf";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../../repo/logo.jpg';
import style from '../../css/style.css';
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

export default function SessionCreator({session, onSessionChange}) {

  const [sessionName, setSessionName] = useState('Elettronica');
  const [simulatorUrl, setSimulatorUrl] = useState('https://thinkercad.com');

  async function createSession() {
    const id = await ApiService.createSessionAsProf(sessionName);
    console.log(id);
    onSessionChange({
      ...session,
      simulatorUrl,
      id
    });
  }

  function openCreateGroups() {
    onSessionChange({
      ...session,
      state: SessionStates.GROUP_CREATION,
    });
  }

  if (session.id) {
    return renderId();
  } else {
    return renderForm();
  }


  function renderId() {
    return (
      <Fragment>
        <ThemeProvider theme={theme}>
          <img src={logo} className={style.centro}/>
          <br/>
          <Paper className={style.paper} elevation={3}>
            <div className={style.title}><h3>Codice sessione:<br/>{session.id}</h3></div>

            <br/>
            <br/>
            <div className={style.bottone}>
              <Button onClick={openCreateGroups} variant="contained" color="primary">
                Vai a creazione gruppi
              </Button>
            </div>
          </Paper>
        </ThemeProvider>
      </Fragment>
    );
  }

  function renderForm() {
    return (
      <Fragment>
        <ThemeProvider theme={theme}>
          <img src={logo} className={style.centro}/>
          <br/>
          <Paper className={style.paper} elevation={3}>
            <div className={style.title}><h3>Avvia una nuova lezione</h3></div>
            <TextField className={style.input}
                       id="standard-multiline-flexible"
                       label="Nome lezione"
                       multiline
                       rowsMax={4}
                       value={sessionName}
                       onChange={handleInputChange(setSessionName)}
            />
            <TextField className={style.input}
                       id="standard-multiline-flexible"
                       label="link al laboratorio"
                       multiline
                       rowsMax={4}
                       value={simulatorUrl}
                       onChange={handleInputChange(setSimulatorUrl)}
            />
            <br/>
            <br/>

            <div className={style.bottone}>
              <Button onClick={createSession} variant="contained" color="primary">
                Crea Sessione
              </Button>
            </div>
          </Paper>
        </ThemeProvider>
      </Fragment>
    );
  }
};
