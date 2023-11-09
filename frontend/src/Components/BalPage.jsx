import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./BalPage.css";
import axios from 'axios';

function BalPage() {
  let canvas;
  let ctx;
  const [ gameData, setGameData ] = useState([]);

  function drawLevel(ctx, data) {
    if (!data || data.length < 1) {
      return false;
    }
    let gameOver = false;
    const rows = data.length;
    const columns = data[0].length;

    let dw1 = canvas.width / columns;
    let dw2 = canvas.height / rows;

    if (dw2 < dw1) {
      dw1 = dw2;
    }
    dw1 = Math.round(dw1);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    dymin = 0;
    for (let row = 0; row < rows; row++) {
      const rowData = data[row];
      dymax = Math.round(dymin + dw1) - 1;
      dxmin = 0;
      for (let col = 0; col < columns; col++) {
        dxmax = Math.round(dxmin + dw1) - 1;
        xmin = Math.round(dxmin);
        xmax = Math.round(dxmax);
        ymin = Math.round(dymin);
        ymax = Math.round(dymax);
        w1 = xmax - xmin + 1;
        w2 = ymax - ymin + 1;
        xc = (xmax + xmin) / 2;
        yc = (ymax + ymin) / 2;

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(xmin, ymin, w1, w2);
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.strokeRect(xmin, ymin, w1, w2);
        const colData = rowData.slice(col, col + 1);
        switch (colData) {
          case "1":
            // wall
            ctx.fillStyle = "rgb(70, 70, 70)";
            ctx.fillRect(xmin, ymin, w1, w2);
            ctx.strokeStyle = "rgb(70, 70, 70)";
            ctx.strokeRect(xmin, ymin, w1, w2);
            break;
          case "2":
            // blue ball
            ctx.fillStyle = "rgb(0, 0, 255)";
            ctx.beginPath();
            ctx.arc(
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            eye = Math.round(w1 / 10);

            if (eye < 2) {
              eye = 2;
            }
            d1 = dw1 / 3.25;
            d2 = d1 - eye;
            d3 = Math.round(w1 / 12);
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.arc(
              Math.round(dxmin + d1),
              Math.round(yc - d3),
              eye * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.arc(
              Math.round(dxmax - d1),
              Math.round(yc - d3),
              eye * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();

            d1 = w1 / 3.5;
            d2 = w1 / 3;
            d3 = w1 / 2;
            d4 = w1 / 2;
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
          case "3":
            // green ball
            ctx.fillStyle = "rgb(0, 150, 0)";
            ctx.beginPath();
            ctx.arc(
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.75,
              w1 * 0.25,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            break;
          case "4":
            // white ball
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.arc(
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            break;
          case "8":
            // red ball
            ctx.fillStyle = "rgb(225, 0, 0)";
            ctx.beginPath();
            ctx.arc(
              xmin + w1 * 0.5,
              (row + 1) * w1 - w1 * 0.5,
              w1 * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            eye = Math.round(w1 / 10);

            if (eye < 2) {
              eye = 2;
            }
            d1 = dw1 / 3.25;
            d2 = d1 - eye;
            d3 = Math.round(w1 / 12);
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.arc(
              Math.round(dxmin + d1),
              Math.round(yc - d3),
              eye * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.arc(
              Math.round(dxmax - d1),
              Math.round(yc - d3),
              eye * 0.5,
              0,
              2 * Math.PI,
              false
            );
            ctx.fill();

            d1 = w1 / 6;
            d2 = w1 / 5;
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.beginPath();
            ctx.moveTo(xc - d1, yc + d2);
            ctx.lineTo(xc + d1, yc + d2);
            ctx.stroke();
            break;
          default:
            // empty
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(xmin, ymin, w1, w2);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(xmin, ymin, w1, w2);
            break;
        }
        dxmin = dxmin + dw1;
      }
      dymin = dymin + dw1;
    }
  }

  async function initLevel(n) {
    let level = n.toString();
    let data = [];
    try {
      const response = await axios.post(`${import.meta.env.VITE_BE_URL}/api/bal/initlevel`, {level: level});
      //console.log(response);
      data = response.data.gameData;
      setGameData(data);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    initLevel(2);
  }, []);

  useEffect(() => {
    canvas = document.querySelector(".myCanvas");
    ctx = canvas.getContext("2d");
    console.log("gameData: ", gameData);
    drawLevel(ctx, gameData);
  }, [gameData]);

  return (
    <div>
      <Navbar />
      <canvas className="myCanvas">
        <p>Add suitable fallback here.</p>
      </canvas>
    </div>
  );
}

export default BalPage;
