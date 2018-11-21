import React, { Component } from "react";
import { getData } from "../../services/utils";

const input = getData(30, ["date", "open"]);

export default class LinearRegression extends Component {
  state = {
    text: "ML Sandbox",
  };

  render() {
    const { text } = this.state;

    return (
      <div>
        {text}
      </div>
    );
  }
}
