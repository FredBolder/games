function canMoveAlone(n) {
  // Object that can move, but not together with another object
  return [9, 28, 84, 85, 86].includes(n);
}

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
    case "5":
      result = 5;
      break;
    case "U":
      result = 106;
      break;
    case "D":
      result = 6;
      break;
    case "L":
      result = 7;
      break;
    case "R":
      result = 107;
      break;
    case "8":
      result = 8;
      break;
    case "9":
      result = 9;
      break;
    case "p":
      result = 28;
      break;
    case "C":
      result = 84;
      break;
    case "c":
      result = 85;
      break;
    case "+":
      result = 86;
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
    case 5:
      result = "5";
      break;
    case 106:
      result = "U";
      break;
    case 6:
      result = "D";
      break;
    case 7:
      result = "L";
      break;
    case 107:
      result = "R";
      break;
    case 8:
      result = "8";
      break;
    case 9:
      result = "9";
      break;
    case 28:
      result = "p";
      break;
    case 84:
      result = "C";
      break;
    case 85:
      result = "c";
      break;
    case 86:
      result = "+";
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

function updateRed(redBalls, x1, y1, x2, y2) {
  for (let i = 0; i < redBalls.length; i++) {
    if (redBalls[i].x === x1 && redBalls[i].y === y1) {
      redBalls[i].x = x2;
      redBalls[i].y = y2;
    }
  }
}

function updateYellow(yellowBalls, x1, y1, x2, y2, direction) {
  for (let i = 0; i < yellowBalls.length; i++) {
    if (yellowBalls[i].x === x1 && yellowBalls[i].y === y1) {
      yellowBalls[i].x = x2;
      yellowBalls[i].y = y2;
      yellowBalls[i].direction = direction;
    }
  }
}

export function checkFalling(arr, redBalls) {
  let result = {};
  result.falling = false;
  result.player = false;

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
        if (element1 === 8) {
          updateRed(redBalls, j, i, j, i + 1);
        }
        arr[i + 1][j] = arr[i][j];
        arr[i][j] = 0;
      }
    }
  }
  return result;
}

function whiteOrBlue(n) {
  return n === 4 || n === 5;
}

export function moveLeft(arr, x, y, yellowBalls = []) {
  let result = {};
  let row = arr[y];
  result.eating = false;
  result.player = false;

  if (arr.length > 0) {
    if (arr[y + 1][x] !== 0) {
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
        // 1 object
        if (
          (whiteOrBlue(row[x - 1]) || canMoveAlone(row[x - 1])) &&
          row[x - 2] === 0
        ) {
          if (row[x - 1] === 9) {
            updateYellow(yellowBalls, x - 1, y, x - 2, y, "left");
          }
          row[x - 2] = row[x - 1];
          row[x - 1] = 2;
          row[x] = 0;
          result.player = true;
        }
      }
      if (x > 2) {
        // 2 white balls
        if (
          whiteOrBlue(row[x - 1]) &&
          whiteOrBlue(row[x - 2]) &&
          row[x - 3] === 0
        ) {
          row[x - 3] = row[x - 2];
          row[x - 2] = row[x - 1];
          row[x - 1] = 2;
          row[x] = 0;
          result.player = true;
        }
      }
    }
  }
  return result;
}

export function moveRight(arr, x, y, yellowBalls = []) {
  let result = {};
  let row = arr[y];
  let maxX = 0;
  result.eating = false;
  result.player = false;

  if (arr.length > 0) {
    if (arr[y + 1][x] !== 0) {
      maxX = arr[0].length - 1;
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
        // 1 object
        if (
          (whiteOrBlue(row[x + 1]) || canMoveAlone(row[x + 1])) &&
          row[x + 2] === 0
        ) {
          if (row[x + 1] === 9) {
            updateYellow(yellowBalls, x + 1, y, x + 2, y, "right");
          }
          row[x + 2] = row[x + 1];
          row[x + 1] = 2;
          row[x] = 0;
          result.player = true;
        }
      }
      if (x < maxX - 2) {
        // 2 white balls
        if (
          whiteOrBlue(row[x + 1]) &&
          whiteOrBlue(row[x + 2]) &&
          row[x + 3] === 0
        ) {
          row[x + 3] = row[x + 2];
          row[x + 2] = row[x + 1];
          row[x + 1] = 2;
          row[x] = 0;
          result.player = true;
        }
      }
    }
  }
  return result;
}

export function jump(arr, x, y, yellowBalls = []) {
  let result = {};
  result.eating = false;
  result.player = false;
  if (arr.length > 0) {
    if (y > 0) {
      if (arr[y - 1][x] === 0 || arr[y - 1][x] === 3) {
        if (arr[y - 1][x] === 3) {
          result.eating = true;
        }
        arr[y - 1][x] = 2;
        arr[y][x] = 0;
        result.player = true;
      }
    }
    if (y > 1) {
      if (canMoveAlone(arr[y - 1][x]) && arr[y - 2][x] === 0) {
        if (arr[y - 1][x] === 9) {
          updateYellow(yellowBalls, x, y - 1, x, y - 2, "up");
        }
        arr[y - 2][x] = arr[y - 1][x];
        arr[y - 1][x] = 2;
        arr[y][x] = 0;
        result.player = true;
      }
    }
  }
  return result;
}

export function jumpLeft(arr, x, y) {
  let result = {};
  result.eating = false;
  result.player = false;
  if (arr.length > 0) {
    if (y > 0 && x > 0) {
      if (arr[y - 1][x] === 0) {
        if (arr[y - 1][x - 1] === 0 || arr[y - 1][x - 1] === 3) {
          if (arr[y - 1][x - 1] === 3) {
            result.eating = true;
          }
          arr[y - 1][x - 1] = 2;
          arr[y][x] = 0;
          result.player = true;
        }
      }
    }
  }
  return result;
}

export function jumpRight(arr, x, y) {
  let result = {};
  result.eating = false;
  result.player = false;
  if (arr.length > 0) {
    if (y > 0 && x < arr[0].length - 1) {
      if (arr[y - 1][x] === 0) {
        if (arr[y - 1][x + 1] === 0 || arr[y - 1][x + 1] === 3) {
          if (arr[y - 1][x + 1] === 3) {
            result.eating = true;
          }
          arr[y - 1][x + 1] = 2;
          arr[y][x] = 0;
          result.player = true;
        }
      }
    }
  }
  return result;
}

export function pushDown(arr, x, y, yellowBalls = []) {
  let result = {};
  result.player = false;
  if (arr.length > 0) {
    // Code michal, see code jump for example
  }
  return result;
}

export function getGameInfo(arr) {
  let result = {};
  result.elevators = [];
  result.greenBalls = 0;
  result.horizontalElevators = [];
  result.redBalls = [];
  result.yellowBalls = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === 3) {
        result.greenBalls++;
      }
      if (arr[i][j] === 8) {
        let redBall = {};
        redBall.x = j;
        redBall.y = i;
        result.redBalls.push(redBall);
      }
      if (arr[i][j] === 106 || arr[i][j] === 6) {
        let elevator = {};
        elevator.x = j;
        elevator.y = i;
        elevator.up = arr[i][j] === 106;
        result.elevators.push(elevator);
      }
      if (arr[i][j] === 107 || arr[i][j] === 7) {
        let elevator = {};
        elevator.x = j;
        elevator.y = i;
        elevator.right = arr[i][j] === 107;
        result.horizontalElevators.push(elevator);
      }
      if (arr[i][j] === 9) {
        let yellowBall = {};
        yellowBall.x = j;
        yellowBall.y = i;
        yellowBall.direction = "none";
        result.yellowBalls.push(yellowBall);
      }
    }
  }
  return result;
}

export function checkRed(arr, x, y, redBalls) {
  let result = {};
  result.hit = false;
  result.x1 = -1;
  result.x2 = -1;
  result.y = -1;
  for (let i = 0; i < redBalls.length; i++) {
    if (redBalls[i].y === y) {
      result.y = y;
      result.hit = true;
      if (redBalls[i].x > x) {
        result.x1 = x + 1;
        result.x2 = redBalls[i].x - 1;
      } else {
        result.x1 = redBalls[i].x + 1;
        result.x2 = x - 1;
      }
      if (result.x2 >= result.x1) {
        for (let j = result.x1; j <= result.x2; j++) {
          if (arr[y][j] !== 0) {
            result.hit = false;
            result.x1 = -1;
            result.x2 = -1;
            result.y = -1;
          }
        }
      }
    }
  }
  return result;
}

export function moveElevators(arr, elevators, redBalls) {
  let result = {};
  result.playerX = -1; // Set to new position if player is moved
  result.playerY = -1; // Set to new position if player is moved

  //console.log("moveElevators");
  for (let i = 0; i < elevators.length; i++) {
    let directionChanged = false;
    let downPossible = false;
    let upPossible = true;
    let emptyUp = -1;
    let x = 0;
    let y = 0;

    // Check in which directions it is possible to move
    for (let j = elevators[i].y; j >= 0; j--) {
      if (emptyUp === -1 && arr[j][elevators[i].x] === 0) {
        emptyUp = j;
      }
      if (emptyUp === -1) {
        if (![2, 4, 8, 6, 106].includes(arr[j][elevators[i].x])) {
          upPossible = false;
        }
      }
    }
    if (emptyUp === -1) {
      upPossible = false;
    }
    if (elevators[i].y < arr.length - 1) {
      downPossible = arr[elevators[i].y + 1][elevators[i].x] === 0;
    }

    //console.log("downPossible: ", downPossible);
    //console.log("upPossible: ", upPossible);

    // Change the direction of the elevator if needed
    if (elevators[i].up) {
      if (!upPossible && downPossible) {
        elevators[i].up = false;
        arr[elevators[i].y][elevators[i].x] = 6;
        directionChanged = true;
      }
    } else {
      if (!downPossible && upPossible) {
        elevators[i].up = true;
        arr[elevators[i].y][elevators[i].x] = 106;
        directionChanged = true;
      }
    }

    if (!directionChanged) {
      // Move the elevator and everything that is on top of it
      x = elevators[i].x;
      y = elevators[i].y;
      if (elevators[i].up) {
        // Move up
        if (upPossible) {
          for (let j = emptyUp; j < y; j++) {
            arr[j][x] = arr[j + 1][x];
            switch (arr[j][x]) {
              case 2:
                result.playerX = x;
                result.playerY = j;
                break;
              case 8:
                updateRed(redBalls, x, j + 1, x, j);
                break;
              default:
                break;
            }
          }
          elevators[i].y = y - 1;
          arr[y][x] = 0;
        }
      } else {
        // Move down
        if (downPossible) {
          arr[y + 1][x] = arr[y][x];
          arr[y][x] = 0;
          elevators[i].y = y + 1;
          for (let j = arr.length - 2; j >= 0; j--) {
            if (arr[j + 1][x] === 0 && [2, 4, 8].includes(arr[j][x])) {
              if (arr[j][x] === 2) {
                result.playerX = x;
                result.playerY = j + 1;
              }
              if (arr[j][x] === 8) {
                updateRed(redBalls, x, j, x, j + 1);
              }
              arr[j + 1][x] = arr[j][x];
              arr[j][x] = 0;
            }
          }
        }
      }
    }
  }
  return result;
}

export function moveHorizontalElevators(arr, elevators, redBalls) {
  let result = {};
  let stop = false;

  result.playerX = -1; // Set to new position if player is moved
  result.playerY = -1; // Set to new position if player is moved

  for (let i = 0; i < elevators.length; i++) {
    let directionChanged = false;
    let x = elevators[i].x;
    let y = elevators[i].y;

    if (elevators[i].right) {
      if (arr[y][x + 1] !== 0 && arr[y][x - 1] === 0) {
        elevators[i].right = false;
        arr[y][x] = 7;
        directionChanged = true;
      }
    } else {
      if (arr[y][x - 1] !== 0 && arr[y][x + 1] === 0) {
        elevators[i].right = true;
        arr[y][x] = 107;
        directionChanged = true;
      }
    }

    if (!directionChanged) {
      // Move right
      if (elevators[i].right && arr[y][x + 1] === 0) {
        arr[y][x + 1] = 107;
        arr[y][x] = 0;
        elevators[i].x = x + 1;
        stop = false;
        for (let j = y - 1; j >= 0 && !stop; j--) {
          if ([2, 4, 8].includes(arr[j][x]) && arr[j][x + 1] === 0) {
            if (arr[j][x] === 8) {
              updateRed(redBalls, x, j, x + 1, j);
            }
            if (arr[j][x] === 2) {
              result.playerX = x + 1;
              result.playerY = j;
            }
            arr[j][x + 1] = arr[j][x];
            arr[j][x] = 0;
          } else {
            stop = true;
          }
        }
      }

      // Move left
      if (!elevators[i].right && arr[y][x - 1] === 0) {
        arr[y][x - 1] = 7;
        arr[y][x] = 0;
        elevators[i].x = x - 1;
        stop = false;
        for (let j = y - 1; j >= 0 && !stop; j--) {
          if ([2, 4, 8].includes(arr[j][x]) && arr[j][x - 1] === 0) {
            if (arr[j][x] === 8) {
              updateRed(redBalls, x, j, x - 1, j);
            }
            if (arr[j][x] === 2) {
              result.playerX = x - 1;
              result.playerY = j;
            }
            arr[j][x - 1] = arr[j][x];
            arr[j][x] = 0;
          } else {
            stop = true;
          }
        }
      }
    }
  }
  return result;
}

export function moveYellowBalls(arr, yellowBalls) {
  for (let i = 0; i < yellowBalls.length; i++) {
    let moved = false;
    let xOld = yellowBalls[i].x;
    let yOld = yellowBalls[i].y;
    switch (yellowBalls[i].direction) {
      case "left":
        if (arr[yOld][xOld - 1] === 0) {
          moved = true;
          yellowBalls[i].x--;
        }
        if (arr[yOld][xOld - 1] === 86) {
          moved = true;
          yellowBalls[i].direction = "right";
        }
        if (arr[yOld][xOld - 1] === 84 && arr[yOld + 1][xOld - 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "down";
          yellowBalls[i].x--;
          yellowBalls[i].y++;
        }
        if (arr[yOld][xOld - 1] === 85 && arr[yOld - 1][xOld - 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "up";
          yellowBalls[i].x--;
          yellowBalls[i].y--;
        }
        break;
      case "right":
        if (arr[yOld][xOld + 1] === 0) {
          moved = true;
          yellowBalls[i].x++;
        }
        if (arr[yOld][xOld + 1] === 86) {
          moved = true;
          yellowBalls[i].direction = "left";
        }
        if (arr[yOld][xOld + 1] === 84 && arr[yOld - 1][xOld + 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "up";
          yellowBalls[i].x++;
          yellowBalls[i].y--;
        }
        if (arr[yOld][xOld + 1] === 85 && arr[yOld + 1][xOld + 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "down";
          yellowBalls[i].x++;
          yellowBalls[i].y++;
        }
        break;
      case "up":
        if (arr[yOld - 1][xOld] === 0) {
          moved = true;
          yellowBalls[i].y--;
        }
        if (arr[yOld - 1][xOld] === 86) {
          moved = true;
          yellowBalls[i].direction = "down";
        }
        if (arr[yOld - 1][xOld] === 84 && arr[yOld - 1][xOld + 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "right";
          yellowBalls[i].x++;
          yellowBalls[i].y--;
        }
        if (arr[yOld - 1][xOld] === 85 && arr[yOld - 1][xOld - 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "left";
          yellowBalls[i].x--;
          yellowBalls[i].y--;
        }
        break;
      case "down":
        if (arr[yOld + 1][xOld] === 0) {
          moved = true;
          yellowBalls[i].y++;
        }
        if (arr[yOld + 1][xOld] === 86) {
          moved = true;
          yellowBalls[i].direction = "up";
        }
        if (arr[yOld + 1][xOld] === 84 && arr[yOld + 1][xOld - 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "left";
          yellowBalls[i].x--;
          yellowBalls[i].y++;
        }
        if (arr[yOld + 1][xOld] === 85 && arr[yOld + 1][xOld + 1] === 0) {
          moved = true;
          yellowBalls[i].direction = "right";
          yellowBalls[i].x++;
          yellowBalls[i].y++;
        }
        break;
      default:
        break;
    }
    if (moved) {
      arr[yOld][xOld] = 0;
      arr[yellowBalls[i].y][yellowBalls[i].x] = 9;
    } else {
      yellowBalls[i].direction = "none";
    }
  }
}
