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
  for (let i = arr.length - 2; i >= 0; i--) {
    for (let j = 0; j < arr[i].length; j++) {
      let element1 = arr[i][j];
      let element2 = arr[i + 1][j];
      if (
        element2 === 0 &&
        (element1 === 2 || element1 === 4 || element1 === 8)
      ) {
        result.falling = true;
        if (element1 === 2) {
          result.player = true;
        }
        arr[i + 1][j] = arr[i][j];
        arr[i][j] = 0;
      }
    }
  }
  return result;
}

export function moveLeft(arr, x, y) {
  let result = {};
  let row = arr[y];
  result.eating = false;
  result.player = false;
  if (arr.length > 0) {
    if (x > 0) {
      // empty space
      if (row[x - 1] === 0 || row[x - 1] === 3) {
        // green ball
        if (row[x - 1] === 3) {
          result.eating = true;
        }
        row[x] = 0;
        row[x - 1] = 2;
        result.player = true;
      }
    }
    if (x > 1) {
      // 1 white ball
      if (row[x - 1] === 4 && row[x - 2] === 0) {
        row[x] = 0;
        row[x - 1] = 2;
        row[x - 2] = 4;
        result.player = true;
      }
    }
    if (x > 2) {
      // 2 white balls
      if (row[x - 1] === 4 && row[x - 2] === 4 && row[x - 3] === 0) {
        row[x] = 0;
        row[x - 1] = 2;
        row[x - 2] = 4;
        row[x - 3] = 4;
        result.player = true;
      }
    }
  }
  return result;
}

export function moveRight(arr, x, y) {
  let result = {};
  let row = arr[y];
  let maxX = 0;
  result.eating = false;
  result.player = false;
  // whats the maximum length of game area??
  if (arr.length > 0) {
    maxX = arr[0].length;
    if (x < maxX) {
      // empty space
      if (row[x + 1] === 0 || row[x + 1] === 3) {
        // green ball
        if (row[x + 1] === 3) {
          result.eating = true;
        }
        row[x] = 0;
        row[x + 1] = 2;
        result.player = true;
      }
    }
    if (x < maxX - 1) {
      // 1 white ball
      if (row[x + 1] === 4 && row[x + 2] === 0) {
        row[x] = 0;
        row[x + 1] = 2;
        row[x + 2] = 4;
        result.player = true;
      }
    }
    if (x < maxX - 2) {
      // 2 white balls
      if (row[x + 1] === 4 && row[x + 2] === 4 && row[x + 3] === 0) {
        row[x] = 0;
        row[x + 1] = 2;
        row[x + 2] = 4;
        row[x + 3] = 4;
        result.player = true;
      }
    }
  }
  return result;
}
