import { hot } from "react-hot-loader";
import React from "react";

import "./App.css";
import LinearRegression from "../LinearRegression/LinearRegression";

const App = () => (
  <div>
    <LinearRegression />
  </div>
);

export default hot(module)(App);
