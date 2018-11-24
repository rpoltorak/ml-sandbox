import React, { Component } from "react";
import { ComposedChart, XAxis, YAxis, Scatter, Line } from "recharts";
import math from "mathjs";

import { retrieveData } from "../../services/utils.js";
import data from "../../data/alior.json";

function normalEquation(X, Y) {
  return math.eval(`inv(X' * X) * X' * Y`, { X, Y });
}

function LeastSquare(X, Y) {
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

const SIZE = 100;
const EPOCHS = 100;
const LEARNING_RATE = 0.000005;

export default class NeuralNetwork extends Component {
  state = {
    a: 1,
    b: 1,
    X: [],
    y: [],
    chartData: [],
    matrix: [],
    epochs: 0,
    cost: 0
  };

  componentDidMount() {
    const matrix = retrieveData(data, SIZE, "open", 1);

    let X = math.eval('matrix[:, 2]', {
      matrix,
    });

    // Output vector
    let Y = math.eval('matrix[:, 1]', {
      matrix,
    });

    const chartData = math.squeeze(Y).map((value, index) => ({ x: index, y: value }));

    const averageY = math.squeeze(Y).reduce((a, b) => a + b, 0) / Y.length;

    this.setState(state => ({
      matrix,
      chartData,
      b: averageY,
      X: math.squeeze(X),
      Y: math.squeeze(Y)
    }));

    this.interval = setInterval(this.learn, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateErrors = () => {
    const data = this.state.chartData;

    let forecastErrorSum = 0;
    let ySum = 0;

    for (let i = 0; i < data.length - 1; i++) {
      ySum += data[i].y
      forecastErrorSum += data[i+1].y - data[i].p;
    }

    let yMean = ySum / data.length;
    let squaredErrorSum = 0;

    for (let i = 0; i < data.length - 1; i++) {
      squaredErrorSum += math.square(data[i].y - yMean);
    }

    console.log("Mean squared error MSE:", squaredErrorSum / data.length);
    console.log("Forecast error:", forecastErrorSum / data.length);

    console.log(this.state.matrix);
  }

  // learn = () => {
  //   if (this.state.epochs >= EPOCHS) {
  //     clearInterval(this.interval);
  //     this.calculateErrors();
  //     return;
  //   }

  //   const { X, Y } = this.state;

  //   let aSum = 0;
  //   let bSum = 0;

  //   for (let i = 0; i < SIZE; i++) {
  //     aSum += (this.hypothesis(X[i]) - Y[i]) * X[i];
  //     bSum += this.hypothesis(X[i]) - Y[i];
  //   }

  //   const a = this.state.a - (LEARNING_RATE / SIZE) * aSum;
  //   const b = this.state.b - (LEARNING_RATE / SIZE) * bSum;

  //   this.setState(state => ({
  //     epochs: state.epochs + 1,
  //     chartData: state.chartData.map(({ x, y }) => ({ x, y, p: this.hypothesis(x) })),
  //     a,
  //     b
  //   }));
  // }

  // learn = () => {
  //   if (this.state.epochs >= EPOCHS) {
  //     clearInterval(this.interval);
  //     this.calculateErrors();
  //     return;
  //   }

  //   const { X, Y } = this.state;

  //   let a = this.state.a;
  //   let b = this.state.b;

  //   for (let i = 0; i < SIZE; i++) {
  //     const prediction = this.hypothesis(X[i]);
  //     const error = Y[i] - prediction;
  //     a = a + (X[i] * error) * LEARNING_RATE;
  //     b = b + error * LEARNING_RATE;
  //   }

  //   const chartData = this.state.chartData.map(({ x, y }) => ({ x, y, p: this.hypothesis(x) }));

  //   this.setState(state => ({
  //     epochs: state.epochs + 1,
  //     chartData,
  //     a,
  //     b
  //   }));
  // }

  learn = () => {
    if (this.state.epochs >= EPOCHS) {
      clearInterval(this.interval);
      this.calculateErrors();
      return;
    }

    const { X, Y } = this.state;

    let a = this.state.a;
    let b = this.state.b;

    let aGradient = 0;
    let bGradient = 0;
    let costSum = 0;

    for (let i = 0; i < SIZE; i++) {
      aGradient += -2 * X[i] * (Y[i] - (a * X[i] + b));
      bGradient += -2 * (Y[i] - (a * X[i] + b));
      costSum += math.square(Y[i] - (a * X[i] + b));
    }

    a -= (LEARNING_RATE * aGradient * (1/SIZE));
    b -= (LEARNING_RATE * bGradient * (1/SIZE));

    const cost = (1/SIZE) * costSum;

    const chartData = this.state.chartData.map(({ x, y }) => ({ x, y, p: this.hypothesis(x) }));

    this.setState(state => ({
      epochs: state.epochs + 1,
      chartData,
      cost,
      a,
      b
    }));
  }

  hypothesis = x => {
    const { a, b } = this.state;

    // Simple linear function
    return (a * x) + b;
  };

  render() {
    if (!this.state.a || !this.state.b) {
      return null;
    }

    const a = math.format(this.state.a, { precision: 3 });
    const b = math.format(this.state.b, { precision: 3 });

    const data = this.state.chartData.map(({ x, y }) => ({ x, y, p: this.hypothesis(x) }));

    let meanSquaredError = 0;

    for (let i = 0; i < data.length - 1; i++) {
      meanSquaredError += math.square(data[i+1].y - data[i].p);
    }

    console.log("Mean squared error MSE:", meanSquaredError / data.length);

    console.log(data);

    return (
      <div>
        <div>epochs: {this.state.epochs}</div>
        {/* <div>cost: {this.state.cost}</div> */}
        <div>Mean squared error MSE:: {meanSquaredError / data.length}</div>
        <div>
          f(x) = {a}x + {b}
        </div>
        <ComposedChart width={1000} height={600} data={this.state.chartData}>
          <XAxis domain={[0, 100]} />
          <YAxis domain={[0, 100]}/>
          <Line type="monotone" dataKey="y" stroke="transparent" dot={{ stroke: "red", strokeWidth: 0, fill: "#8884d8" }} />
          <Line type="monotone" dataKey="p" stroke="#82ca9d" dot={false} />
        </ComposedChart>
        <div>
          <table>
            <thead>
              <tr>
                <th>y</th>
                <th>y-1</th>
              </tr>
            </thead>
            <tbody>
              {this.state.matrix.map(row => (
                <tr key={Math.random()}>
                  {row.map(item => (
                    <th key={Math.random()}>{item}</th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
