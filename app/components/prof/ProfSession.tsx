import React, {useState} from 'react';
import {ThemeProvider} from "@material-ui/styles";
import logo from "../../../logo.png";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ApiService from "../../service/ApiService";
import {theme} from "../theme";
import style from '../../css/style.css';

export default function ProfSession ({session, onSessionChange}) {

  const [studentsList, setStudentList] = useState(ApiService.studentsList);


  return (
    <div className={style.container}>
      <ThemeProvider theme={theme}>
        <img src={logo} className={style.centro} width="80%"/>
        <br/>
        <Paper className={style.paper} elevation={3}  style={{borderRadius: '20px'}}>
          <div className={style.title}><h3>Group 7</h3></div>
          <ul>
            {
              studentsList.map(student => (
                <li>{student.fullname}</li>
              ))
            }
          </ul>
          <div className={style.bottone}>
            <Button variant="contained" color="primary">
              Check out the group
            </Button>
          </div>
        </Paper>
      </ThemeProvider>
    </div>
  );
}
