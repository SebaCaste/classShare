import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import routes from '../../constants/routes.json';
import styles from '../Home.css';
import {handleInputChange} from "../utils";
import SessionCreator from "./SessionCreator";
import SessionCreateGroup from "./SessionCreateGroup";
import ProfSession from "./ProfSession";
import style from '../../css/style.css';


export const SessionStates = {
  NOT_CREATED: 'not-created',
  GROUP_CREATION: 'group-creation',
  STARTED: 'started'
}

export default function HomeProf() {

  const [session, setSession] = useState({
    state: SessionStates.NOT_CREATED
  });


  switch (session.state) {
    case SessionStates.NOT_CREATED:
      return (
        <SessionCreator session={session} onSessionChange={setSession}/>
      );

    case SessionStates.GROUP_CREATION:
      return (
        <SessionCreateGroup session={session} onSessionChange={setSession}/>
      );

    case SessionStates.STARTED:
      return (
        <ProfSession session={session} onSessionChange={setSession}/>
      );
  }
}
