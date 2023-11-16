import React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { drawFilledBox, drawFilledCircle, drawLine } from "../drawUtils";
import {
  stringArrayToNumberArray,
  checkFalling,
  moveLeft,
  moveRight,
  jump,
  jumpLeft,
  jumpRight,
  getGameInfo,
} from "../balUtils.js";

let gameData = [];
let posX = -1;
let posY = -1;
let gameInterval;
let skipFalling = 2;
let gameInfo = {};
gameInfo.greenBalls = 0;
gameInfo.redBalls = [];

function BalPage() {
  let canvas;
  let ctx;

  function drawLevel(ctx, data) {
    if (!data || data.length < 1) {
      return false;
    }
    let gameOver = false;
    const rows = data.length;
    const columns = data[0].length;

    let size1 = canvas.width / columns;
    let size2 = canvas.height / rows;

    if (size2 < size1) {
      size1 = size2;
    }
    size1 = Math.round(size1);
    drawFilledBox(ctx, 0, 0, canvas.width, canvas.height, "black");
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

    dymin = 0;
    for (let row = 0; row < rows; row++) {
      dymax = Math.round(dymin + size1) - 1;
      dxmin = 0;
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
            if (eye < 2) {
              eye = 2;
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
              ctx.strokeStyle = "rgb(255, 255, 255)";
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
              ctx.strokeStyle = "rgb(255, 255, 255)";
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
            if (eye < 2) {
              eye = 2;
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
          default:
            // empty
            drawFilledBox(ctx, xmin, ymin, w1, w2, "black");
            break;
        }
        dxmin += size1;
      }
      dymin += size1;
    }
  }

  function gameScheduler() {
    let info = {};

    if (skipFalling <= 0) {
      info = checkFalling(gameData);
      if (info.player) {
        posY++;
      }
      if (info.falling) {
        updateScreen();
      }
    } else {
      skipFalling--;
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
      updateScreen();
      gameInfo = getGameInfo();
    } catch (err) {
      console.log(err);
    }
  }

  function changeLevel(e) {
    initLevel(Number(e.target.value));
    e.target.blur();
  }

  function handleClick(e) {
    let info = {};
    info.player = false;
    info.eating = false;

    //console.log(posX, posY, gameData.length);
    if (posX === -1 || posY === -1 || gameData.length === 0) {
      return false;
    }
    if (e.shiftKey) {
      switch (e.key) {
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
          info = moveLeft(gameData, posX, posY);
          if (info.player) {
            posX--;
          }
          break;
        case "ArrowRight":
        case "d":
          info = moveRight(gameData, posX, posY);
          if (info.player) {
            posX++;
          }
          break;
        case "ArrowUp":
        case "w":
          info = jump(gameData, posX, posY);
          if (info.player) {
            posY--;
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
    }
    if (info.eating) {
      // TODO: Eating sound and decrease number of green balls
    }
  }

  const myRef = useRef(document);

  useEffect(() => {
    initLevel(1);
    updateScreen();
    myRef.current.addEventListener("keydown", handleClick);
    gameInterval = setInterval(gameScheduler, 50);

    return () => {
      myRef.current.removeEventListener("keydown", handleClick);
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
    <div>
      <Navbar />
      <div className="mainBody">
        <div className="hero-content">
          <h1 className="hero-title">Bal - The Game for Smart People</h1>
          <div className="levelSelector">
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
            </select>
          </div>
          <canvas className="gameCanvas">
            <p>Bal</p>
          </canvas>
        </div>
      </div>
    </div>
  );
}

export default BalPage;
