export function pick(obj, keys) {
  return Object.assign({}, ...keys.map(k => k in obj ? {[k]: obj[k]} : {}));
}

export function retrieveData(data, length, field, predictionLevel) {
  const dataSet = data.map(item => item[field]);

  if (length + predictionLevel > data.length) {
    throw Error("Specified length is bigger than provided data");
  }

  let result = [];

  for (let i = 0; i < length; i++) {
    let row = [];

    for (let j = predictionLevel; j >= 0; j--) {
      row.push(dataSet[i + j])
    }

    result.push(row);
  }

  return result;
}
