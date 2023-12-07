import React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import axios from "axios";
// https://www.npmjs.com/package/react-confirm-alert
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
  checkDetonator,
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
import Footer from "./Footer";
import imgBlueHappy from "../Images/blue_ball_happy.svg";
import imgBlueSad from "../Images/blue_ball_sad.svg";
import imgLightBlue from "../Images/light_blue_ball.svg";
import imgRed from "../Images/red_ball.svg";
import imgGreen from "../Images/green_ball.svg";
import imgPurple from "../Images/purple_ball.svg";
import imgWhite from "../Images/white_ball.svg";
import imgYellow from "../Images/yellow_ball.svg";
import arrowJumpLeft from "../Images/arrow_topLeft.svg";
import arrowJumpRight from "../Images/arrow_topRight.svg";
import arrowDown from "../Images/arrow_down.svg";
import arrowUp from "../Images/arrow_up.svg";
import arrowLeft from "../Images/arrow_left.svg";
import arrowRight from "../Images/arrow_right.svg";

let canvas;
let cbGraphics = null;
let cbSound = null;
let completed = [];
let ctx;
let currentLevel = 200;
let elementGreen;
let elementHappy;
let elementLightBlue;
let elementPurple;
let elementRed;
let elementSad;
let elementWhite;
let elementYellow;
let elevatorCounter = 0;
let explosionCounter = 0;
let gameData = [];
let gameInfo = {};
gameInfo.elevators = [];
gameInfo.horizontalElevators = [];
gameInfo.greenBalls = 0;
gameInfo.redBalls = [];
gameInfo.yellowBalls = [];
gameInfo.detonator = { x: -1, y: -1 };
let gameInterval;
let gameOver = false;
let laserX1 = -1;
let laserX2 = -1;
let laserY = -1;
let nextButton = false;
let posX = -1;
let posY = -1;
let series;
let settings = { sound: true, nicerGraphics: true };
let skipFalling = 0;
let yellowCounter = 0;

function BalPage() {
  const [green, setGreen] = useState(0);
  const [levelNumber, setLevelNumber] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function credentials() {
    return import.meta.env.VITE_NODE_ENV !== "development";
  }

  async function addLevel(n) {
    let level = n.toString();

    if (!completed.includes(level)) {
      completed.push(level);
    }
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/addcompleted`,
        { level: level },
        { withCredentials: credentials() }
      );
    } catch (error) {
      alert(error);
    }
  }

  async function getCompleted() {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/getcompleted`,
        { withCredentials: credentials() }
      );
      const balLevels = response.data.balLevels;
      if (balLevels === "") {
        completed = [];
      } else {
        completed = balLevels.split(",");
      }
      //alert(completed.toString());
      updateNextButton();
    } catch (error) {
      alert(error);
    }
  }

  async function setLast(n) {
    let level = n.toString();

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/setlast`,
        { level: level },
        { withCredentials: credentials() }
      );
    } catch (error) {
      alert(error);
    }
  }

  async function getLast() {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/getlast`,
        { withCredentials: credentials() }
      );
      let level = response.data.balLastPlayed;
      if (level !== "") {
        level = Number(level);
        confirmAlert({
          title: "Question",
          message: `Load level ${level}?`,
          buttons: [
            {
              label: "Yes",
              onClick: () => {
                currentLevel = level;
                initLevel(currentLevel);
              },
            },
            {
              label: "No",
              onClick: () => {},
            },
          ],
        });
      }
    } catch (error) {
      alert(error);
    }
  }

  async function loadSettings() {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/loadsettings`,
        { withCredentials: credentials() }
      );
      let balSettings = JSON.parse(response.data.balSettings);
      settings.nicerGraphics = balSettings.nicerGraphics;
      settings.sound = balSettings.sound;
      if (cbGraphics !== null) {
        cbGraphics.checked = settings.nicerGraphics;
      }
      if (cbSound !== null) {
        cbSound.checked = settings.sound;
      }
    } catch (error) {
      alert(error);
    }
  }

  async function saveSettings() {
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/savesettings`,
        { balSettings: JSON.stringify(settings) },
        { withCredentials: credentials() }
      );
    } catch (error) {
      alert(error);
    }
  }

  function updateNextButton() {
    nextButton = completed.includes(currentLevel.toString());
    setShowNext(nextButton);
  }

  function playSound(sound) {
    let snd = null;
    let n = 0;

    if (settings.sound) {
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
        case "explosion":
          snd = sndExplosion;
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
    if (!data || data.length < 1 || !canvas) {
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
    let d4 = 0;
    let d5 = 0;
    let d6 = 0;
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
            drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
            break;
          case 2:
            // blue ball
            if (posX === -1 || posY === -1) {
              posX = col;
              posY = row;
            }

            if (settings.nicerGraphics) {
              if (gameOver) {
                ctx.drawImage(elementSad, xmin, ymin, w1, w2);
              } else {
                ctx.drawImage(elementHappy, xmin, ymin, w1, w2);
              }
            } else {
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
            }
            break;
          case 3:
            // green ball
            if (settings.nicerGraphics) {
              ctx.drawImage(
                elementGreen,
                xmin + w1 * 0.25,
                ymin,
                w1 * 0.5,
                w2 * 0.5
              );
            } else {
              drawFilledCircle(
                ctx,
                xmin + w1 * 0.5,
                (row + 1) * w1 - w1 * 0.75,
                w1 * 0.25,
                "green"
              );
            }
            break;
          case 4:
            // white ball
            if (settings.nicerGraphics) {
              ctx.drawImage(elementWhite, xmin, ymin, w1, w2);
            } else {
              drawFilledCircle(
                ctx,
                xmin + w1 * 0.5,
                (row + 1) * w1 - w1 * 0.5,
                w1 * 0.5,
                "white"
              );
            }
            break;
          case 5:
            //light blue ball
            if (settings.nicerGraphics) {
              ctx.drawImage(elementLightBlue, xmin, ymin, w1, w2);
            } else {
              drawFilledCircle(
                ctx,
                xmin + w1 * 0.5,
                (row + 1) * w1 - w1 * 0.5,
                w1 * 0.5,
                "deepskyblue"
              );
            }
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
            if (settings.nicerGraphics) {
              ctx.drawImage(elementRed, xmin, ymin, w1, w2);
            } else {
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
            }
            break;
          case 9:
            // yellow ball
            if (settings.nicerGraphics) {
              ctx.drawImage(elementYellow, xmin, ymin, w1, w2);
            } else {
              drawFilledCircle(
                ctx,
                xmin + w1 * 0.5,
                (row + 1) * w1 - w1 * 0.5,
                w1 * 0.5,
                "yellow"
              );
            }
            break;
          case 10:
            // one direction to right >
            drawBox(ctx, xmin, ymin, w1, w2, "white");
            drawLine(ctx, xmin, ymin, xmax, ymin + w2 / 2, "white");
            drawLine(ctx, xmin, ymax, xmax, ymin + w2 / 2, "white");
            break;
          case 11:
            // one direction to left <
            drawBox(ctx, xmin, ymin, w1, w2, "white");
            drawLine(ctx, xmax, ymin, xmin, ymin + w2 / 2, "white");
            drawLine(ctx, xmax, ymax, xmin, ymin + w2 / 2, "white");
            break;
          case 28:
            // purple ball
            if (settings.nicerGraphics) {
              ctx.drawImage(elementPurple, xmin, ymin, w1, w2);
            } else {
              drawFilledCircle(
                ctx,
                xmin + w1 * 0.5,
                (row + 1) * w1 - w1 * 0.5,
                w1 * 0.5,
                "darkmagenta"
              );
            }
            break;
          case 36:
            // Bomb
            drawFilledBox(ctx, xmin, ymin, w1, w2, "black");
            let factor = 0.1;
            d1 = w1 / 6;
            d2 = w1 / 2;
            d3 = d2 + Math.round(w2 * factor);
            d4 = d3 + Math.round(w2 * factor);
            d5 = d4 + Math.round(w2 * factor);
            d6 = w1 / 6;
            drawFilledBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d2),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "red"
            );
            drawBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d2),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "black"
            );
            drawFilledBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d3),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "red"
            );
            drawBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d3),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "black"
            );
            drawFilledBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d4),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "red"
            );
            drawBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d4),
              w1 - Math.round(2 * d1),
              Math.round(w2 * factor),
              "black"
            );
            drawLine(
              ctx,
              Math.round(xc - d6),
              Math.round(ymin + d2),
              Math.round(xc - d6),
              Math.round(ymin + d5)
            );
            drawLine(
              ctx,
              Math.round(xc + d6),
              Math.round(ymin + d2),
              Math.round(xc + d6),
              Math.round(ymin + d5)
            );
            break;
          case 37:
            // Detonator
            d1 = w1 / 7;
            d2 = w1 / 2;
            d3 = w1 / 1;
            d4 = w1 / 8;
            d5 = w1 / 6;
            drawFilledBox(
              ctx,
              Math.round(xmin + d1),
              Math.round(ymin + d2),
              w1 - Math.round(2 * d1),
              Math.round(w2 - d2),
              "red"
            );
            drawLine(
              ctx,
              xc,
              Math.round(ymin + d4),
              xc,
              Math.round(ymin + d2),
              "rgb(220,220,220)"
            );
            drawLine(
              ctx,
              Math.round(xc - d5),
              Math.round(ymin + d4),
              Math.round(xc + d5),
              Math.round(ymin + d4),
              "rgb(220,220,220)"
            );
            drawText(
              ctx,
              xc,
              ymin + w2 * 0.8,
              "TNT",
              "middle",
              "white",
              Math.round(w2 * 0.45),
              Math.round(w1 * 0.65),
              "white",
              1
            );
            break;
          case 38:
            // Explosion
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            d1 = w1 / 10;
            d2 = w2 / 2;
            ctx.moveTo(Math.round(xc - d1), Math.round(yc - d2));
            d1 = w1 / 8;
            d2 = w2 / 7;
            ctx.lineTo(Math.round(xc + d1), Math.round(yc - d2));
            d1 = w1 / 2;
            d2 = 0;
            ctx.lineTo(Math.round(xc + d1), Math.round(yc - d2));
            d1 = w1 / 6;
            d2 = w2 / 7;
            ctx.lineTo(Math.round(xc + d1), Math.round(yc + d2));
            d1 = w1 / 8;
            d2 = w2 / 2;
            ctx.lineTo(Math.round(xc + d1), Math.round(yc + d2));
            d1 = w1 / 8;
            d2 = w2 / 9;
            ctx.lineTo(Math.round(xc - d1), Math.round(yc + d2));
            d1 = w1 / 2.5;
            d2 = 0;
            ctx.lineTo(Math.round(xc - d1), Math.round(yc - d2));
            d1 = w1 / 4;
            d2 = w2 / 12;
            ctx.lineTo(Math.round(xc - d1), Math.round(yc - d2));
            ctx.closePath();
            ctx.fill();
            break;
          case 84:
            drawFilledBox(ctx, xmin, ymin, w1, w2, "yellow");
            drawLine(ctx, xmin, ymax, xmax, ymin, "black");
            break;
          case 85:
            drawFilledBox(ctx, xmin, ymin, w1, w2, "yellow");
            drawLine(ctx, xmin, ymin, xmax, ymax, "black");
            break;
          case 86:
            drawFilledBox(ctx, xmin, ymin, w1, w2, "yellow");
            break;
          case 87:
            // one direction up ^
            drawBox(ctx, xmin, ymin, w1, w2, "white");
            drawLine(ctx, xmin, ymax, xc, ymin, "white");
            drawLine(ctx, xmax, ymax, xc, ymin, "white");
            break;
          case 88:
            // one direction down v
            drawBox(ctx, xmin, ymin, w1, w2, "white");
            drawLine(ctx, xmin, ymin, xc, ymax, "white");
            drawLine(ctx, xmax, ymin, xc, ymax, "white");
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

    if (!gameOver && gameData) {
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

        info = moveHorizontalElevators(
          gameData,
          gameInfo.horizontalElevators,
          gameInfo.redBalls
        );
        if (info.playerX !== -1 && info.playerY !== -1) {
          posX = info.playerX;
          posY = info.playerY;
        }
        if (gameInfo.elevators.length > 0) {
          update = true;
        }
      }

      if (yellowCounter > 0) {
        yellowCounter--;
      } else {
        yellowCounter = 1;
        moveYellowBalls(gameData, gameInfo.yellowBalls);
        update = true;
      }

      if (explosionCounter > 0) {
        explosionCounter--;
      } else {
        explosionCounter = 2;
        if (
          checkDetonator(gameData, gameInfo.detonator.x, gameInfo.detonator.y)
        ) {
          playSound("explosion");
        }
        update = true;
      }

      if (update) {
        updateScreen();
        checkGameOver();
      }
    }
  }

  function help(e) {
    setShowHelp(!showHelp);
  }

  async function initLevel(n, setLastPlayed = true) {
    let level = n.toString();
    let data = [];

    try {
      setLevelNumber(n);
      if (setLastPlayed) {
        setLast(n);
      }
      updateNextButton();
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

  function clickSeries1(e) {
    confirmAlert({
      title: "Question",
      message: "Load the first level of series 1?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            currentLevel = 200;
            initLevel(currentLevel);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  function clickSeries2(e) {
    confirmAlert({
      title: "Question",
      message: "Load the first level of series 2?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            currentLevel = 700;
            initLevel(currentLevel);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  function handleChangeSettings(e) {
    settings.nicerGraphics = cbGraphics.checked;
    settings.sound = cbSound.checked;
    saveSettings();
  }

  function handleKeyDown(e) {
    let info = {};
    info.player = false;
    info.eating = false;

    if (gameOver || !canvas) {
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
        case "A":
        case "4":
          info = moveLeft(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posX--;
            if (info.oneDirection) {
              posX--;
            }
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case "6":
          info = moveRight(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posX++;
            if (info.oneDirection) {
              posX++;
            }
          }
          break;
        case "ArrowUp":
        case "w":
        case "W":
        case "8":
          info = jump(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posY--;
            if (info.oneDirection) {
              posY--;
            }
            elevatorCounter++; // To prevent that you fall from the elevator
          }
          break;
        case "q":
        case "Q":
        case "7":
          info = jumpLeft(gameData, posX, posY);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "e":
        case "E":
        case "9":
          info = jumpRight(gameData, posX, posY);
          if (info.player) {
            posX++;
            posY--;
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "2":
          info = pushDown(gameData, posX, posY, gameInfo.yellowBalls);
          if (info.player) {
            posY++;
            if (info.oneDirection) {
              posY++;
            }
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
      checkGameOver();
      if (!gameOver && gameInfo.greenBalls <= 0) {
        addLevel(currentLevel);
        currentLevel++;
        initLevel(currentLevel);
      }
    }
  }

  function handleResize(e) {
    updateScreen();
  }

  function nextLevelClick(e) {
    confirmAlert({
      title: "Question",
      message: "Load the next level?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            currentLevel++;
            initLevel(currentLevel);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  function tryAgain(e) {
    confirmAlert({
      title: "Question",
      message: "Initialize level?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            initLevel(currentLevel);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  const myRef = useRef(document);

  useEffect(() => {
    elementHappy = document.getElementById("happy");
    elementSad = document.getElementById("sad");
    elementRed = document.getElementById("red");
    elementGreen = document.getElementById("green");
    elementLightBlue = document.getElementById("light_blue");
    elementPurple = document.getElementById("purple");
    elementWhite = document.getElementById("white");
    elementYellow = document.getElementById("yellow");

    getCompleted();
    currentLevel = 200;
    initLevel(currentLevel, false);
    cbGraphics = document.getElementById("graphics");
    cbSound = document.getElementById("sound");
    loadSettings();
    getLast();

    myRef.current.addEventListener("keydown", handleKeyDown);
    //window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    gameInterval = setInterval(gameScheduler, 50);

    return () => {
      myRef.current.removeEventListener("keydown", handleKeyDown);
      //window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      clearInterval(gameInterval);
    };
  }, []);

  function updateScreen() {
    canvas = document.querySelector(".gameCanvas");
    if (!canvas) {
      return false;
    }
    series = document.getElementById("series");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    //console.log("gameData: ", gameData);
    drawLevel(ctx, gameData);
  }

  function buttonJumpLeft(e) {
    handleKeyDown({ key: "7", shiftKey: false });
  }

  function buttonJumpRight(e) {
    handleKeyDown({ key: "9", shiftKey: false });
  }

  function buttonMoveLeft(e) {
    handleKeyDown({ key: "4", shiftKey: false });
  }

  function buttonMoveRight(e) {
    handleKeyDown({ key: "6", shiftKey: false });
  }

  function buttonJump(e) {
    handleKeyDown({ key: "8", shiftKey: false });
  }

  function buttonDown(e) {
    handleKeyDown({ key: "2", shiftKey: false });
  }

  return (
    <div className="page">
      <main>
        <header>
          <Navbar />
        </header>
        <div className="title">Bal - The Game for Smart People</div>
        <div className="balPanel">
          <div className="balPanelText">
            Level: <span className="balPanelTextSpan">{levelNumber}</span>
          </div>
          <div className="menu">
            <button className="balButton">Load</button>
            <div className="menu-content">
              <div onClick={clickSeries1}>
                <label>Series 1</label>
              </div>
              <div onClick={clickSeries2}>
                <label>Series 2</label>
              </div>
            </div>
          </div>
          <button className="balButton" onClick={tryAgain}>
            Try again
          </button>
          {showNext && (
            <button className="balButton" onClick={nextLevelClick}>
              Next
            </button>
          )}
          <div className="balPanelText">
            Green: <span className="balPanelTextSpan">{green}</span>
          </div>

          <button className="balButton" onClick={help}>
            Help
          </button>

          <div className="menu">
            <button className="balButton">Settings</button>
            <div className="menu-content">
              <div>
                <input
                  type="checkbox"
                  id="sound"
                  name="sound"
                  value="sound"
                  onChange={handleChangeSettings}
                />
                <label for="sound">Sound</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="graphics"
                  name="graphics"
                  value="graphics"
                  onChange={handleChangeSettings}
                />
                <label for="graphics">Nicer graphics</label>
              </div>
            </div>
          </div>
        </div>
        {showHelp ? (
          <div className="help" onClick={help}>
            <h2>Help</h2>
            <p>
              In every level you control the blue ball with the happy face. You
              have to eat all the little green balls. You can push the white
              balls and the light blue balls, but not more than 2 at the same
              time. The light blue balls are floating balls and they will always
              stay at the same height. Red balls are very dangerous. If you push
              a yellow ball, it will continue as far as possible. You cannot
              push more yellow balls at the same time or push a yellow ball
              together with another ball. You can push a yellow ball in the
              directions left, right, up and down. A purple ball is almost the
              same as a yellow ball, but when you push a purple ball, it will go
              only one position further. You cannot push a ball through a one
              direction or a door with a lock. You can control the blue ball
              with the letter keys, the arrow keys, the number keys or the arrow
              buttons.
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">Action</th>
                  <th scope="col">Letter key</th>
                  <th scope="col">Arrow key</th>
                  <th scope="col">Number key</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Walk left</td>
                  <td>A</td>
                  <td>Arrow left</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Walk right</td>
                  <td>D</td>
                  <td>Arrow right</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td>Jump / Push up</td>
                  <td>W</td>
                  <td>Arrow up</td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>Jump left</td>
                  <td>Q</td>
                  <td>Shift + Arrow left</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Jump right</td>
                  <td>E</td>
                  <td>Shift + Arrow right</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>Push down</td>
                  <td>S</td>
                  <td>Arrow down</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
            <p>
              If you have already solved a certain level before, there is a Next
              button available to continue with the next level.
            </p>
          </div>
        ) : (
          <canvas className="gameCanvas">
            <p>Bal</p>
          </canvas>
        )}
        <div className="moveButtons">
          <button onClick={buttonJumpLeft}>
            <img src={arrowJumpLeft} alt="ArrowJumpLeft" />
          </button>
          <button onClick={buttonMoveLeft}>
            <img src={arrowLeft} alt="ArrowLeft" />
          </button>
          <button onClick={buttonJump}>
            <img src={arrowUp} alt="ArrowUp" />
          </button>
          <button onClick={buttonDown}>
            <img src={arrowDown} alt="ArrowDown" />
          </button>
          <button onClick={buttonMoveRight}>
            <img src={arrowRight} alt="ArrowRight" />
          </button>
          <button onClick={buttonJumpRight}>
            <img src={arrowJumpRight} alt="ArrowJumpRight" />
          </button>
        </div>
        <div style={{ display: "none" }}>
          <img id="happy" src={imgBlueHappy} />
        </div>
        <div style={{ display: "none" }}>
          <img id="sad" src={imgBlueSad} />
        </div>
        <div style={{ display: "none" }}>
          <img id="light_blue" src={imgLightBlue} />
        </div>
        <div style={{ display: "none" }}>
          <img id="red" src={imgRed} />
        </div>
        <div style={{ display: "none" }}>
          <img id="green" src={imgGreen} />
        </div>
        <div style={{ display: "none" }}>
          <img id="purple" src={imgPurple} />
        </div>
        <div style={{ display: "none" }}>
          <img id="white" src={imgWhite} />
        </div>
        <div style={{ display: "none" }}>
          <img id="yellow" src={imgYellow} />
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default BalPage;
