import React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import {
  drawBox,
  drawFilledBox,
  drawFilledCircle,
  drawLine,
  drawText,
} from "../drawUtils";
import {
  stringArrayToNumberArray,
  checkFalling,
  moveLeft,
  moveRight,
  jump,
  jumpLeft,
  jumpRight,
  getGameInfo,
  checkRed,
  moveElevators,
  moveHorizontalElevators,
  moveYellowBalls,
  pushDown,
} from "../balUtils.js";
import sndCatapult from "../Sounds/catapult.wav";
import sndEat1 from "../Sounds/eat1.wav";
import sndEat2 from "../Sounds/eat2.wav";
import sndEat3 from "../Sounds/eat3.wav";
import sndEat4 from "../Sounds/eat4.wav";
import sndExplosion from "../Sounds/explosion.wav";
import sndFloor1 from "../Sounds/floor1.wav";
import sndFloor2 from "../Sounds/floor2.wav";
import sndHinge from "../Sounds/hinge.wav";
import sndKey from "../Sounds/key.wav";
import sndLaserGun from "../Sounds/laser_gun.wav";
import sndPain from "../Sounds/pain.wav";
import sndPickaxe from "../Sounds/pickaxe.wav";
import sndSplash1 from "../Sounds/splash1.wav";
import sndSplash2 from "../Sounds/splash2.wav";
import sndTake from "../Sounds/take.wav";
import sndTeleport from "../Sounds/teleport.wav";
import sndUnlock from "../Sounds/unlock.wav";

let canvas;
let ctx;
let currentLevel = 200;
let elevatorCounter = 0;
let gameData = [];
let gameInfo = {};
gameInfo.elevators = [];
gameInfo.greenBalls = 0;
gameInfo.redBalls = [];
gameInfo.yellowBalls = [];
let gameInterval;
let gameOver = false;
let laserX1 = -1;
let laserX2 = -1;
let laserY = -1;
let posX = -1;
let posY = -1;
let skipFalling = 0;

function BalPage() {
  const [green, setGreen] = useState(0);

  function playSound(sound) {
    let snd = null;
    let n = 0;
    switch (sound) {
      case "eat":
        n = Math.trunc(Math.random() * 4) + 1;
        switch (n) {
          case 1:
            snd = sndEat1;
            break;
          case 2:
            snd = sndEat2;
            break;
          case 3:
            snd = sndEat3;
            break;
          case 4:
            snd = sndEat4;
            break;
          default:
            break;
        }
        break;
      case "laser":
        snd = sndLaserGun;
        break;
      default:
        break;
    }
    if (snd !== sound) {
      const audio = new Audio(snd);
      audio.play();
    }
  }

  function checkGameOver() {
    if (!gameOver) {
      let redInfo = checkRed(gameData, posX, posY, gameInfo.redBalls);
      if (redInfo.hit) {
        gameOver = true;
        laserX1 = redInfo.x1;
        laserX2 = redInfo.x2;
        laserY = redInfo.y;
        updateScreen();
        playSound("laser");
      }
    }
  }

  function drawLevel(ctx, data) {
    if (!data || data.length < 1) {
      return false;
    }
    const rows = data.length;
    const columns = data[0].length;

    let size1 = canvas.width / columns;
    let size2 = canvas.height / rows;

    if (size2 < size1) {
      size1 = size2;
    }
    size1 = Math.round(size1);
    let gameWidth = columns * size1;
    let gameHeight = rows * size1;
    let leftMargin = Math.trunc((canvas.width - gameWidth) / 2);
    drawFilledBox(ctx, leftMargin, 0, gameWidth, gameHeight, "black");
    let dxmin = 0;
    let dxmax = 0;
    let dymin = 0;
    let dymax = 0;
    let xmin = 0;
    let xmax = 0;
    let ymin = 0;
    let ymax = 0;
    let xc = 0;
    let yc = 0;
    let w1 = 0;
    let w2 = 0;
    let eye = 0;
    let d1 = 0;
    let d2 = 0;
    let d3 = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.imageSmoothingEnabled = false;
    dymin = 0;
    for (let row = 0; row < rows; row++) {
      dymax = Math.round(dymin + size1) - 1;
      dxmin = leftMargin;
      for (let col = 0; col < columns; col++) {
        dxmax = Math.round(dxmin + size1) - 1;
        xmin = Math.round(dxmin);
        xmax = Math.round(dxmax);
        ymin = Math.round(dymin);
        ymax = Math.round(dymax);
        w1 = xmax - xmin + 1;
        w2 = ymax - ymin + 1;
        xc = Math.round((xmax + xmin) / 2);
        yc = Math.round((ymax + ymin) / 2);

        const colData = data[row][col];
        switch (colData) {
          case 0:
            // empty
            //drawFilledBox(ctx, xmin, ymin, w1, w2, "black");
            break;
          case 1:
            // wall
            drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
            break;
          case 2:
            // blue ball
            if (posX === -1 || posY === -1) {
              posX = col;
              posY = row;
            }
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              "blue"
            );

            eye = Math.round(w1 / 20);
            if (eye < 1) {
              eye = 1;
            }
            d1 = size1 / 3.25;
            d2 = Math.round(w1 / 12);
            drawFilledCircle(
              ctx,
              Math.round(dxmin + d1),
              Math.round(yc - d2),
              eye,
              "white"
            );
            drawFilledCircle(
              ctx,
              Math.round(dxmax - d1),
              Math.round(yc - d2),
              eye,
              "white"
            );

            d1 = w1 / 3.5;
            d2 = w1 / 3;
            d3 = w1 / 2;
            if (gameOver) {
              ctx.strokeStyle = "white";
              ctx.beginPath();
              ctx.arc(
                Math.round(xc),
                Math.round(yc + d3),
                Math.round(w1 - 2 * d1),
                1.25 * Math.PI,
                1.75 * Math.PI,
                false
              );
              ctx.stroke();
            } else {
              ctx.strokeStyle = "white";
              ctx.beginPath();
              ctx.arc(
                Math.round(xc),
                Math.round(ymin + d2),
                Math.round(w1 - 2 * d1),
                0.25 * Math.PI,
                0.75 * Math.PI,
                false
              );
              ctx.stroke();
            }
            break;
          case 3:
            // green ball
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.75,
              w1 * 0.25,
              "green"
            );
            break;
          case 4:
            // white ball
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              "white"
            );
            break;
          case 5:
            //light blue ball
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              "deepskyblue"
            );
            break;
          case 6:
          case 106:
            // Elevator up/down
            drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
            d1 = w1 / 3;
            d2 = w1 / 10;
            d3 = w1 / 8;
            drawLine(
              ctx,
              xc,
              Math.round(yc - d1),
              xc,
              Math.round(yc + d1),
              "white"
            );
            drawLine(
              ctx,
              xc,
              Math.round(yc - d1),
              Math.round(xc - d2),
              Math.round(yc - d3),
              "white"
            );
            drawLine(
              ctx,
              xc,
              Math.round(yc - d1),
              Math.round(xc + d2),
              Math.round(yc - d3),
              "white"
            );
            drawLine(
              ctx,
              xc,
              Math.round(yc + d1),
              Math.round(xc - d2),
              Math.round(yc + d3),
              "white"
            );
            drawLine(
              ctx,
              xc,
              Math.round(yc + d1),
              Math.round(xc + d2),
              Math.round(yc + d3),
              "white"
            );
            break;
          //elevator left/right
          case 7:
          case 107:
            // Elevator left/right
            drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
            d1 = w1 / 3;
            d2 = w1 / 10;
            d3 = w1 / 8;
            drawLine(
              ctx,
              Math.round(xc - d1),
              yc,
              Math.round(xc + d1),
              yc,
              "white"
            );
            drawLine(
              ctx,
              Math.round(xc - d1),
              yc,
              Math.round(xc - d3),
              Math.round(yc - d2),
              "white"
            );
            drawLine(
              ctx,
              Math.round(xc - d1),
              yc,
              Math.round(xc - d3),
              Math.round(yc + d2),
              "white"
            );
            drawLine(
              ctx,
              Math.round(xc + d1),
              yc,
              Math.round(xc + d3),
              Math.round(yc - d2),
              "white"
            );
            drawLine(
              ctx,
              Math.round(xc + d1),
              yc,
              Math.round(xc + d3),
              Math.round(yc + d2),
              "white"
            );
            break;
          case 8:
            // red ball
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              "red"
            );

            eye = Math.round(w1 / 20);
            if (eye < 1) {
              eye = 1;
            }
            d1 = size1 / 3.25;
            d2 = Math.round(w1 / 12);
            drawFilledCircle(
              ctx,
              Math.round(dxmin + d1),
              Math.round(yc - d2),
              eye,
              "white"
            );
            drawFilledCircle(
              ctx,
              Math.round(dxmax - d1),
              Math.round(yc - d2),
              eye,
              "white"
            );

            d1 = w1 / 6;
            d2 = w1 / 5;
            drawLine(ctx, xc - d1, yc + d2, xc + d1, yc + d2, "white");
            break;
          case 9:
            // yellow ball
            drawFilledCircle(
              ctx,
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              "yellow"
            );
            break;
          default:
            // empty
            drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
            break;
        }
        dxmin += size1;
      }
      dymin += size1;
    }
    if (gameOver) {
      x1 = leftMargin + gameWidth / 2;
      y1 = gameHeight / 2;
      drawText(
        ctx,
        x1,
        y1,
        "GAME OVER!",
        "middle",
        "white",
        Math.round(gameHeight * 0.6),
        Math.round(gameWidth * 0.9),
        "red",
        5
      );

      if (laserX1 >= 0 && laserX2 >= 0 && laserY >= 0) {
        x1 = leftMargin + laserX1 * size1;
        x2 = leftMargin + size1 + laserX2 * size1;
        y1 = Math.round(laserY * size1 + size1 / 2);

        drawLine(ctx, x1, y1, x2, y1, "yellow");
      }
    }
  }

  function gameScheduler() {
    let info = {};
    let update = false;

    if (!gameOver) {
      if (skipFalling <= 0) {
        info = checkFalling(gameData, gameInfo.redBalls);
        if (info.player) {
          posY++;
        }
        if (info.falling) {
          update = true;
        }
      } else {
        skipFalling--;
      }

      if (elevatorCounter > 0) {
        elevatorCounter--;
      } else {
        elevatorCounter = 5;
        info = moveElevators(gameData, gameInfo.elevators, gameInfo.redBalls);
        if (info.playerX !== -1 && info.playerY !== -1) {
          posX = info.playerX;
          posY = info.playerY;
        }
        if (gameInfo.elevators.length > 0) {
          update = true;
        }

        info = moveHorizontalElevators(gameData, gameInfo.horizontalElevators, gameInfo.redBalls);
        if (info.playerX !== -1 && info.playerY !== -1) {
          posX = info.playerX;
          posY = info.playerY;
        }
        if (gameInfo.elevators.length > 0) {
          update = true;
        }
      }

      if (update) {
        updateScreen();
        checkGameOver();
      }
    }
  }

  async function initLevel(n) {
    let level = n.toString();
    let data = [];

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/bal/initlevel`,
        { level: level }
      );
      //console.log(response);
      posX = -1;
      posY = -1;
      data = response.data.gameData;
      gameData = stringArrayToNumberArray(data);
      laserX1 = -1;
      laserX2 = -1;
      laserY = -1;
      gameOver = false;
      updateScreen();
      gameInfo = getGameInfo(gameData);
      setGreen(gameInfo.greenBalls);
    } catch (err) {
      console.log(err);
    }
  }

  function changeLevel(e) {
    currentLevel = Number(e.target.value) + 199;
    initLevel(currentLevel);
    e.target.blur();
  }

  function handleKeyDown(e) {
    let info = {};
    info.player = false;
    info.eating = false;

    if (gameOver) {
      return false;
    }
    //console.log(posX, posY, gameData.length);
    if (posX === -1 || posY === -1 || gameData.length === 0) {
      return false;
    }
    if (e.shiftKey) {
      switch (e.key) {
        case "N":
          // TODO: only for test, remove later
          currentLevel++;
          initLevel(currentLevel);
          break;
        case "ArrowLeft":
          info = jumpLeft(gameData, posX, posY);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "ArrowRight":
          info = jumpRight(gameData, posX, posY);
          if (info.player) {
            posX++;
            posY--;
          }
          break;
        default:
          break;
      }
    } else {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          info = moveLeft(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posX--;
          }
          break;
        case "ArrowRight":
        case "d":
          info = moveRight(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posX++;
          }
          break;
        case "ArrowUp":
        case "w":
          info = jump(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posY--;
            elevatorCounter++; // To prevent that you fall from the elevator
          }
          break;
        case "q":
          info = jumpLeft(gameData, posX, posY);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "e":
          info = jumpRight(gameData, posX, posY);
          if (info.player) {
            posX++;
            posY--;
          }
          break;
        default:
          break;
      }
    }
    if (info.player) {
      skipFalling = 1;
      updateScreen();
      checkGameOver();
    }
    if (info.eating) {
      gameInfo.greenBalls--;
      setGreen(gameInfo.greenBalls);
      playSound("eat");
      if (gameInfo.greenBalls <= 0) {
        currentLevel++;
        initLevel(currentLevel);
      }
    }
  }

  function handleResize(e) {
    updateScreen();
  }

  function tryAgain(e) {
    const response = window.confirm("Initialize level?");
    if (response) {
      initLevel(currentLevel);
    }
  }

  const myRef = useRef(document);

  useEffect(() => {
    initLevel(200);
    myRef.current.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    gameInterval = setInterval(gameScheduler, 50);

    return () => {
      myRef.current.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameInterval);
    };
  }, []);

  function updateScreen() {
    canvas = document.querySelector(".gameCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    //console.log("gameData: ", gameData);
    drawLevel(ctx, gameData);
  }

  return (
    <div className="page">
      <header>
        <Navbar />
      </header>
      <main>
        <h1 className="title">Bal - The Game for Smart People</h1>
        <div className="balPanel">
          <div>
            <label>Level </label>
            <select
              name="level"
              id="level"
              defaultValue="1"
              onChange={changeLevel}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <button className="button" onClick={tryAgain}>
            Try again
          </button>
          <div>Green Left: {green}</div>
        </div>
        <canvas className="gameCanvas">
          <p>Bal</p>
        </canvas>
      </main>
    </div>
  );
}

export default BalPage;
