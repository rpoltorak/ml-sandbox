import { hot } from "react-hot-loader";
import React from "react";

import "./App.css";
import LinearRegression from "../LinearRegression/LinearRegression";
import ExtLinearRegression from "../ExtLinearRegression/ExtLinearRegression";
import PolynomialRegression from "../PolynomialRegression/PolynomialRegression";
import NeuralNetwork from "../NeuralNetwork/NeuralNetwork";

class App extends React.Component {
  state = {
    view: "LinearRegression"
  }

  switchView = view => () => {
    this.setState(() => ({ view }));
  }

  renderView = () => {
    switch(this.state.view) {
      case "LinearRegression":
        return <LinearRegression />
      case "ExtLinearRegression":
        return <ExtLinearRegression />
      case "PolynomialRegression":
        return <PolynomialRegression />
      case "NeuralNetwork":
        return <NeuralNetwork />
    }
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={this.switchView("LinearRegression")}>Linear regression</button>
          <button onClick={this.switchView("ExtLinearRegression")}>Linear regression with external param</button>
          <button onClick={this.switchView("PolynomialRegression")}>Polynomial regression</button>
          <button onClick={this.switchView("NeuralNetwork")}>Neural Network</button>
        </div>
        {this.renderView()}
      </div>
    );
  }

}

export default hot(module)(App);
