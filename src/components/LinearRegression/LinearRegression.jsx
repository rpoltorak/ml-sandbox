import React, { Component } from "react";
import { ComposedChart, XAxis, YAxis, Scatter, Line } from "recharts";
import math from "mathjs";

import { retrieveData } from "../../services/utils.js";
import data from "../../data/alior.json";

console.log(data.length);

function normalEquation(X, Y) {
  return math.eval(`inv(X' * X) * X' * Y`, { X, Y });
}

function LSMethod(X, Y) {
  let xSum = 0;
  let ySum = 0;
  let xSquaredSum = 0;
  let xySum = 0;

  for (let i = 0; i < SIZE; i++) {
    xSum += X[i];
    ySum += Y[i];
    xSquaredSum += X[i] * X[i];
    xySum += X[i] * Y[i];
  }

  return [
    [(SIZE * xySum - xSum * ySum) / (SIZE * xSquaredSum - xSum * xSum)],
    [(ySum * xSquaredSum - xSum * xySum) / (SIZE * xSquaredSum - xSum * xSum)]
  ];
}

const SIZE = 230;

export default class LinearRegression extends Component {
  state = {
    a: 0,
    b: 0,
    chartData: []
  };

  calculateParamsNE = () => {
    const matrix = retrieveData(data, SIZE, "open", 2);

    console.log("matrix", matrix);

    // Fisher observation matrix
    let F = math.eval('matrix[:, 2:3]', {
      matrix,
    });

    // Output vector
    let Y = math.eval('matrix[:, 1]', {
      matrix,
    });

    // F = math.concat(math.ones([matrix.length, 1]).valueOf(), F);

    // Parameters vector
    const V = normalEquation(F, Y);
    const params = math.squeeze(V);

    console.log("params", params);

    const chartData = math.squeeze(Y).map((value, index) => ({ x: index, y: value }));

    this.setState(state => ({
      chartData,
      a: params[0],
      b: params[1]
    }));
  }

  calculateParamsLS = () => {
    const matrix = retrieveData(data, SIZE, "open", 2);

    let X = math.squeeze(math.eval('matrix[:, 2]', {
      matrix,
    }));

    let Y = math.squeeze(math.eval('matrix[:, 1]', {
      matrix,
    }));

    console.log(X, Y);

    const V = LSMethod(X, Y);
    const params = math.squeeze(V);

    console.log("params", params);

    const chartData = math.squeeze(Y).map((value, index) => ({ x: index, y: value }));

    this.setState(state => ({
      chartData,
      a: params[0],
      b: params[1]
    }));
  }

  componentDidMount() {
    this.calculateParamsNE();
  }

  hypothesis = x => {
    const { a, b } = this.state;

    // Simple linear function
    return a * x + b;
  };

  render() {
    const a = math.format(this.state.a, { precision: 3 });
    const b = math.format(this.state.b, { precision: 3 });

    const data = this.state.chartData.map(({ x, y }) => ({ x, y, h: this.hypothesis(x) }));

    return (
      <div>
        <div>
          f(x) = {a}x + {b}
        </div>
        <ComposedChart width={1000} height={600} data={data}>
          <XAxis />
          <YAxis />
          <Line type="monotone" dataKey="y" stroke="transparent" dot={{ stroke: "red", strokeWidth: 0, fill: "#8884d8" }} />
          <Line type="monotone" dataKey="h" stroke="#82ca9d" dot={false} />
          {/* <Scatter shape="circle" fill="blue" /> */}
        </ComposedChart>
      </div>
    );
  }
}
``
