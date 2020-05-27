import React, {useState, Fragment} from 'react';
import {handleInputChange} from "../utils";
import ApiService from "../../service/ApiService";
import {SessionStates} from "./HomeProf";

export default function SessionCreator({session, onSessionChange}) {

  const [sessionName, setSessionName] = useState('');

  async function createSession() {
    const id = await ApiService.createSessionAsProf(sessionName);
    console.log(id);
    onSessionChange({
      ...session,
      id
    });
  }

  function openCreateGroups(){
    onSessionChange({
      ...session,
      state: SessionStates.GROUP_CREATION,
    });
  }

  return (
    <div>

      {
        !session.id &&
          <Fragment>
            <input type="text" onChange={handleInputChange(setSessionName)} value={sessionName}/>
            <button onClick={createSession}>Create session</button>
          </Fragment>
      }
      {
        session.id &&
          <Fragment>
            <p>Codice sessione: {session.id}</p>
            <button onClick={openCreateGroups}>Vai a creazione gruppi</button>
          </Fragment>
      }

    </div>
  );
};
