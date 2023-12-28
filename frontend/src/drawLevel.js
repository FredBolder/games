import {
  drawBox,
  drawFilledBox,
  drawFilledCircle,
  drawLine,
  drawText,
} from "./drawUtils";

export default function drawLevel(
  canvas,
  ctx,
  data,
  nicerGraphics,
  elements,
  status,
  gameInfo
) {
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
  size1 = Math.trunc(size1);
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

  for (let i = 0; i < gameInfo.ladders.length; i++) {
    drawLine(
      ctx,
      gameInfo.ladders[i].x * size1 + leftMargin + 1,
      gameInfo.ladders[i].y * size1,
      gameInfo.ladders[i].x * size1 + leftMargin + 1,
      (gameInfo.ladders[i].y + 1) * size1,
      "white"
    );
    drawLine(
      ctx,
      (gameInfo.ladders[i].x + 1) * size1 + leftMargin - 1,
      gameInfo.ladders[i].y * size1,
      (gameInfo.ladders[i].x + 1) * size1 + leftMargin - 1,
      (gameInfo.ladders[i].y + 1) * size1,
      "white"
    );
    drawLine(
      ctx,
      gameInfo.ladders[i].x * size1 + leftMargin + 1,
      (gameInfo.ladders[i].y + 0.5) * size1,
      (gameInfo.ladders[i].x + 1) * size1 + leftMargin - 1,
      (gameInfo.ladders[i].y + 0.5) * size1,
      "white"
    );
  }

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
          if (nicerGraphics) {
            if (status.gameOver) {
              ctx.drawImage(elements.elementSad, xmin, ymin, w1, w2);
            } else {
              ctx.drawImage(elements.elementHappy, xmin, ymin, w1, w2);
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
            if (status.gameOver) {
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
          if (nicerGraphics) {
            ctx.drawImage(
              elements.elementGreen,
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
          if (nicerGraphics) {
            ctx.drawImage(elements.elementWhite, xmin, ymin, w1, w2);
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
          if (nicerGraphics) {
            ctx.drawImage(elements.elementLightBlue, xmin, ymin, w1, w2);
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
          if (nicerGraphics) {
            ctx.drawImage(elements.elementRed, xmin, ymin, w1, w2);
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
          if (nicerGraphics) {
            ctx.drawImage(elements.elementYellow, xmin, ymin, w1, w2);
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
        case 15:
          // wall |\
          ctx.fillStyle = "#464646";
          ctx.beginPath();
          ctx.moveTo(xmin - 1, ymax + 1);
          ctx.lineTo(xmin - 1, ymin - 1);
          ctx.lineTo(xmax + 1, ymax + 1);
          ctx.lineTo(xmin - 1, ymax + 1);
          ctx.fill();
          break;
        case 16:
          // wall /|
          ctx.fillStyle = "#464646";
          ctx.beginPath();
          ctx.moveTo(xmin - 1, ymax + 1);
          ctx.lineTo(xmax + 1, ymin - 1);
          ctx.lineTo(xmax + 1, ymax + 1);
          ctx.lineTo(xmin - 1, ymax + 1);
          ctx.fill();
          break;
        case 17:
          // wall |/
          ctx.fillStyle = "#464646";
          ctx.beginPath();
          ctx.moveTo(xmin - 1, ymax + 1);
          ctx.lineTo(xmin - 1, ymin - 1);
          ctx.lineTo(xmax + 1, ymin - 1);
          ctx.lineTo(xmin - 1, ymax + 1);
          ctx.fill();
          break;
        case 18:
          // wall \|
          ctx.fillStyle = "#464646";
          ctx.beginPath();
          ctx.moveTo(xmin - 1, ymin - 1);
          ctx.lineTo(xmax + 1, ymin - 1);
          ctx.lineTo(xmax + 1, ymax + 1);
          ctx.lineTo(xmin - 1, ymin - 1);
          ctx.fill();
          break;
        case 28:
          // purple ball
          if (nicerGraphics) {
            ctx.drawImage(elements.elementPurple, xmin, ymin, w1, w2);
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
        case 31:
          // teleport - will be drawn later
          break;
        case 36:
          // Bomb
          drawFilledBox(ctx, xmin, ymin, w1, w2, "rgb(70, 70, 70)");
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
  ctx.lineWidth = 3;
  for (let i = 0; i < gameInfo.teleports.length; i++) {
    drawBox(
      ctx,
      gameInfo.teleports[i].x * size1 + leftMargin + 1,
      gameInfo.teleports[i].y * size1 + 1,
      size1 - 2,
      size1 - 2,
      "white"
    );
  }
  ctx.lineWidth = 1;
  if (status.gameOver) {
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

    if (status.laserX1 >= 0 && status.laserX2 >= 0 && status.laserY >= 0) {
      x1 = leftMargin + status.laserX1 * size1;
      x2 = leftMargin + size1 + status.laserX2 * size1;
      y1 = Math.round(status.laserY * size1 + size1 / 2);

      drawLine(ctx, x1, y1, x2, y1, "yellow");
    }
  }
}
