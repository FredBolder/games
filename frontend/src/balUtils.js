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
      break;
  }
  return result;
}

export function stringArrayToNumberArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    const arr2 = [];

    for (let j = 0; j < arr[i].length; j++) {
      arr2.push(charToNumber(arr[i][j]));
    }

    result.push(arr2);
  }

  return result;
}

export function numberArrayToStringArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let string = "";

    for (let j = 0; j < arr[i].length; j++) {
      string += numberToChar(arr[i][j]);
    }

    result.push(string);
  }

  return result;
}
