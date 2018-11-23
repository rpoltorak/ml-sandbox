import { hot } from "react-hot-loader";
import React from "react";

import "./App.css";
import LinearRegression from "../LinearRegression/LinearRegression";
import ExtLinearRegression from "../ExtLinearRegression/ExtLinearRegression";
import PolynomialRegression from "../PolynomialRegression/PolynomialRegression";

const App = () => (
  <div>
    <LinearRegression />
    {/* <ExtLinearRegression /> */}
    {/* <PolynomialRegression /> */}
  </div>
);

export default hot(module)(App);
