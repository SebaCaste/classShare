import React, {useEffect, useState} from 'react';
import ApiService from "../../service/ApiService";
import {StudentSessionStates} from "./HomeStudent";

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
    <div>
      Waiting....
    </div>
  );
}
