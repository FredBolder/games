function charToNumber(c) {
  let result = 0;

  switch (c) {
    case " ":
      result = 0;
      break;
    case "1":
      result = 1;
      break;
    case "2":
      result = 2;
      break;
    case "3":
      result = 3;
      break;
    case "4":
      result = 4;
      break;
    case "8":
      result = 8;
      break;
    default:
      result = 0;
      break;
  }
  return result;
}

function numberToChar(n) {
  let result = " ";

  switch (n) {
    case 0:
      result = " ";
      break;
    case 1:
      result = "1";
      break;
    case 2:
      result = "2";
      break;
    case 3:
      result = "3";
      break;
    case 4:
      result = "4";
      break;
    case 8:
      result = "8";
      break;
    default:
      result = " ";
      break;
  }
  return result;
}

export function stringArrayToNumberArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    const row = [];
    for (let j = 0; j < arr[i].length; j++) {
      row.push(charToNumber(arr[i][j]));
    }
    result.push(row);
  }
  return result;
}

export function numberArrayToStringArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let row = "";
    for (let j = 0; j < arr[i].length; j++) {
      row += numberToChar(arr[i][j]);
    }
    result.push(row);
  }
  return result;
}

export function checkFalling(arr) {
  let result = {};
  result.falling = false;
  result.player = false;

  // code Diana
  return result;
}

export function moveLeft(arr) {
  let result = {};
  result.eating = false;
  result.player = false;

  // code Michal
  return result;
}

export function moveRight(arr) {
  let result = {};
  result.eating = false;
  result.player = false;

  // code Michal
  return result;
}