import React, { useRef, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./TennisPage.css";
import MessageBox from "./MessageBox";
import { randomInt } from "../utils";

let ctx;
let pause = false;
let runGame = false;
let user;
let ball;
let com;
let winningScore = 5;
let selectedSpeed = 6;
let ignoreMouseMove = false;

function TennisPage() {
  let gameInterval;
  const canvas = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const showMessage = (title, message) => {
    setMessageTitle(title);
    setMessageContent(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (pause) {
      resumeGame();
    }
  };

  useEffect(() => {
    const framePerSecond = 60;
    gameInterval = setInterval(gameLoop, 1000 / framePerSecond);
    window.addEventListener("resize", handleResize);
    canvas.current.addEventListener("mousemove", racketMovement);
    updateCanvas();

    ball = {
      x: canvas.current.width / 2,
      y: canvas.current.height / 2,
      radius: 10,
      velocityX: 5,
      velocityY: randomInt(-3, 3),
      speed: selectedSpeed,
    };

    user = {
      width: 10,
      height: 100,
      score: 0,
      x: 0,
      y: (canvas.current.height - 100) / 2,
    };

    com = {
      width: 10,
      height: 100,
      score: 0,
      x: canvas.current.width - 10,
      y: (canvas.current.height - 100) / 2,
    };

    return () => {
      removeEventListener("mousemove", racketMovement);
      window.removeEventListener("resize", handleResize);
      clearInterval(gameInterval);
    };
  }, []);

  function drawBar(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  function drawNet() {
    const width = 2;
    const height = 10;
    let x = Math.round(canvas.current.width / 2);
    for (let y = 0; y < canvas.current.height + height; y += 14) {
      drawBar(x, y, width, height, "white");
    }
  }

  function drawText(text, x, y) {
    ctx.fillStyle = "White";
    ctx.font = "65px League Gothic";
    ctx.fillText(text, x, y);
  }

  function updateScreen() {
    drawBar(0, 0, canvas.current.width, canvas.current.height, "darkgreen");
    drawText(user.score, canvas.current.width / 4, 60);
    drawText(com.score, (3 * canvas.current.width) / 4, 60);
    drawNet();
    // Player racket
    drawBar(user.x, user.y, user.width, user.height, "darkgray");
    // Computer racket
    drawBar(com.x, com.y, com.width, com.height, "darkgray");
    drawBall(ball.x, ball.y, ball.radius, "yellow");
  }

  function gameLoop() {
    if (runGame) {
      checkWinner();
      updateScreen();
      update();
    }
  }

  function racketMovement(event) {
    if (!ignoreMouseMove) {
      let rect = canvas.current.getBoundingClientRect();
      let mouseY = event.clientY - rect.top;
      user.y = Math.min(
        Math.max(mouseY - user.height / 2, 0),
        canvas.current.height - user.height
      );
    }
  }

  function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    return (
      p.left < b.right &&
      p.top < b.bottom &&
      p.right > b.left &&
      p.bottom > b.top
    );
  }

  function resetBall() {
    ball.x = canvas.current.width / 2;
    ball.y = canvas.current.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = selectedSpeed;
  }

  function checkWinner() {
    if (com.score >= winningScore || user.score >= winningScore) {
      runGame = false;
      gameOver(user.score >= winningScore);
    }
  }

  function startGame() {
    if (!runGame) {
      user.score = 0;
      com.score = 0;
      ball.speed = selectedSpeed;
      ball.x = canvas.current.width / 2;
      ball.y = canvas.current.height / 2;
      ball.velocityX = 5;
      ball.velocityY = randomInt(-3, 3);
      ball.speed = selectedSpeed;
      runGame = true;
    }
  }

  function pauseGame() {
    if (runGame) {
      pause = true;
      runGame = false;
      showMessage("Game paused", "Close this message to resume the game.");
    }
  }

  function resumeGame() {
    pause = false;
    runGame = true;
  }

  function stopGame() {
    runGame = false;
  }

  function changeSpeed() {
    let speedSelect = document.getElementById("speedSelect");
    selectedSpeed = parseInt(speedSelect.value);
    ball.speed = selectedSpeed;
  }

  function update() {
    let computerLevel;
    if (ball.x - ball.radius < 0) {
      com.score++;
      resetBall();
    } else if (ball.x + ball.radius > canvas.current.width) {
      user.score++;
      resetBall();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (
      ball.y + ball.radius > canvas.current.height ||
      ball.y - ball.radius < 0
    ) {
      ball.velocityY = -ball.velocityY;
    }
    if (selectedSpeed < 5) {
      computerLevel = 0.03;
    } else {
      computerLevel = 0.04;
    }
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
    ball.speed = selectedSpeed;
    let player = ball.x + ball.radius < canvas.current.width / 2 ? user : com;
    if (collision(ball, player)) {
      let collisionPoint = ball.y - (player.y + player.height / 2);
      collisionPoint = collisionPoint / (player.height / 2);
      let angleRad = collisionPoint * (Math.PI / 4);
      let direction = ball.x + ball.radius < canvas.current.width / 2 ? 1 : -1;
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      ball.speed += 0.4; // Increases the speed of the ball after each hit
    }
  }

  function gameOver(userWins) {
    let msg = userWins
      ? "Congratulations! You win!"
      : "Game Over! Computer wins.";
    showMessage("Information", msg);
  }

  function handleCanvasTouch(e) {
    const touches = e.changedTouches;
    ignoreMouseMove = true;
    let rect = canvas.current.getBoundingClientRect();
    if (touches.length > 0) {
      let y = touches[touches.length - 1].pageY - rect.top;
      if (y < rect.height / 2) {
        user.y -= 30;
      } else {
        user.y += 30;
      }
      if (user.y < 0) {
        user.y = 0;
      }
      if (user.y > rect.height - user.height) {
        user.y = rect.height - user.height;
      }
    }
  }

  function handleResize(e) {
    updateCanvas();
    if (com) {
      com.x = canvas.current.width - com.width;
    }
  }

  function updateCanvas() {
    const displayWidth = canvas.current.clientWidth;
    const displayHeight = canvas.current.clientHeight;
    if (
      canvas.current.width !== displayWidth ||
      canvas.current.height !== displayHeight
    ) {
      canvas.current.width = displayWidth;
      canvas.current.height = displayHeight;
    }
    ctx = canvas.current.getContext("2d");
  }

  return (
    <div className="page">
      <header>
        <Navbar />
      </header>
      <main>
        <div className="tennis-title">Tennis</div>
        <p className="tennis-instruction">
          Move the left paddle with your mouse to hit the ball. If you don't
          have a mouse, you can touch in the upper or lower part of the
          hardcourt to move the paddle. To win the game, get 5 points. To play,
          click the Start button.
        </p>
        <div className="tennis-controls">
          <button onClick={startGame}>Start</button>
          <button onClick={pauseGame}>Pause</button>
          <button onClick={stopGame}>Stop</button>
          <select
            id="speedSelect"
            className="tennis-speed"
            onChange={changeSpeed}
          >
            <option value="3">Slow</option>
            <option value="6" selected="selected">
              Normal
            </option>
            <option value="10">Fast</option>
            <option value="14">Very fast</option>
          </select>
        </div>
        <canvas
          className="tennis-canvas"
          ref={canvas}
          onTouchStart={handleCanvasTouch}
        ></canvas>
      </main>
      <Footer />
      {showModal && (
        <MessageBox
          title={messageTitle}
          message={messageContent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default TennisPage;
