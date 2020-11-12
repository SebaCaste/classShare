import React from 'react';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import Routes from '../Routes';
import {MemoryRouter} from "react-router";

type Props = {
  history: History;
};

const Root = () => (
  <MemoryRouter>
    <Routes />
  </MemoryRouter>
);

export default hot(Root);
