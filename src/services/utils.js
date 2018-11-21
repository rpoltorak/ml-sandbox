import data from "../data.json";

const keys = Object.keys(data[0]);

export function pick(obj, keys) {
  return Object.assign({}, ...keys.map(k => k in obj ? {[k]: obj[k]} : {}));
}

export function getData(length = data.length, fields = keys) {
  return data
    .slice(0, length)
    .map(item => pick(item, fields));
}
