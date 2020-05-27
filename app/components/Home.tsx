import React, {useState} from 'react';
import {Link} from "react-router-dom";
import routes from '../constants/routes.json';
import ApiService from '../service/ApiService';

export default function Home () {
  return (
    <div>
      <Link to={routes.HOME_PROF} onClick={() => ApiService.initAsProf()}>Prof {routes.HOME_PROF}</Link>
      <br/>
      <Link to={routes.HOME_STUDENT} onClick={() => ApiService.initAsStudent()}>Student</Link>
    </div>
  );
}
