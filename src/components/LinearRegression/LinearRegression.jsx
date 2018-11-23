import React, { Component } from "react";
import { ComposedChart, XAxis, YAxis, Scatter, Line } from "recharts";
import math from "mathjs";

import { retrieveData } from "../../services/utils.js";
import data from "../../data/alior.json";

// const getRandomIntFromInterval = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const data = allData.map(item => Object.assign({}, item, { open: getRandomIntFromInterval(30, 50) }));

// console.log(data.length);

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

const SIZE = 50;

export default class LinearRegression extends Component {
  state = {
    a: 0,
    b: 0,
    c: 0,
    chartData: []
  };

  componentDidMount() {
    this.calculateParamsNE();
  }

  calculateParamsNE = () => {
    const matrix = retrieveData(data, SIZE, "open", 2);

    console.log("matrix", matrix);

    let XA = math.eval('matrix[:, 2]', {
      matrix,
    });

    let XB = math.eval('matrix[:, 3]', {
      matrix,
    });

    // Output vector
    let Y = math.eval('matrix[:, 1]', {
      matrix,
    });

    let F = math.concat(math.square(XA), XB, math.ones([matrix.length, 1]).valueOf());

    // Parameters vector
    const V = normalEquation(F, Y);
    const params = math.squeeze(V);

    console.log("F", F);

    console.log("params", params);

    const chartData = math.squeeze(Y).map((value, index) => ({ x: index, y: value }));

    this.setState(state => ({
      chartData,
      a: params[0],
      b: params[1],
      c: params[2],
    }));
  }

  calculateParamsLS = (levels) => {
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

  hypothesis = x => {
    const { a, b, c } = this.state;

    // Simple linear function
    return a * math.pow(x, 2) + b * x + c;
  };

  render() {
    const a = math.format(this.state.a, { precision: 3 });
    const b = math.format(this.state.b, { precision: 3 });
    const c = math.format(this.state.c, { precision: 3 });

    const data = this.state.chartData.map(({ x, y }) => ({ x, y, f: this.hypothesis(x) }));

    console.log(data);

    return (
      <div>
        <div>
          f(x) = {a}x^2 + {b}x + {c}
        </div>
        <ComposedChart width={1000} height={600} data={data}>
          <XAxis domain={[0, "maxData"]} />
          <YAxis domain={[0, "maxData"]}/>
          <Line type="monotone" dataKey="y" stroke="transparent" dot={{ stroke: "red", strokeWidth: 0, fill: "#8884d8" }} />
          <Line type="monotone" dataKey="f" stroke="#82ca9d" dot={false} />
        </ComposedChart>
      </div>
    );
  }
}
``
