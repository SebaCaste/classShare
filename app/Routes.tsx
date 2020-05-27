import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import HomeProf from "./components/prof/HomeProf";
import HomeStudent from "./components/student/HomeStudent";

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.HOME_PROF} component={HomeProf} />
        <Route path={routes.HOME_STUDENT} component={HomeStudent} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
