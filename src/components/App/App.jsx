import { hot } from "react-hot-loader";
import React from "react";

import "./App.css";
import LinearRegression from "../LinearRegression/LinearRegression";
import LinearRegressionExternal from "../LinearRegressionExternal/LinearRegression";

const App = () => (
  <div>
    <LinearRegressionExternal />
  </div>
);

export default hot(module)(App);
