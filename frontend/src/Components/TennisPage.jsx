import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./TennisPage.css";

function TennisPage() {
	let canvas;
	let ctx;
	let gameRunning = false;
	let user;
	let ball;
	let com;
	let net;

	const [currentLevel, setCurrentLevel] = useState(1);

	// Add the startGame function
	function startGame() {
		gameRunning = true;
		gameLoop();
		// document.getElementById("tutorial").classList.add("hidden");
	}

	useEffect(() => {
		canvas = document.getElementById("tennis-canvas");
		canvas.width = 800;
		canvas.height = 500;
		ctx = canvas.getContext("2d");

		// Create the ball
		ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 10,
			velocityX: 5,
			velocityY: 5,
			speed: 7,
			color: "ORANGE",
		};

		// Create the user and computer paddles
		user = {
			x: 0,
			y: (canvas.height - 100) / 2,
			width: 10,
			height: 100,
			score: 0,
			color: "YELLOW",
		};

		com = {
			x: canvas.width - 10,
			y: (canvas.height - 100) / 2,
			width: 10,
			height: 100,
			score: 0,
			color: "YELLOW",
		};

		net = {
			x: canvas.width / 2 - 1,
			y: 0,
			width: 3,
			height: 5,
			color: "WHITE",
		};
	}, []);

	function drawNet() {
		for (let i = 0; i <= canvas.height; i += 14) {
			drawRect(net.x, net.y + i, net.width, net.height, net.color);
		}
	}

	// Other functions
	function drawRect(x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}

	// Score Text
	function drawText(text, x, y) {
		ctx.fillStyle = "White";
		ctx.font = "75px fantasy";
		ctx.fillText(text, x, y);
	}

	// Draw the ball
	function drawBall(x, y, radius, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}

	// Draw the game elements
	function render() {
		drawRect(0, 0, canvas.width, canvas.height, "darkgreen");
		drawText(user.score, canvas.width / 4, canvas.height / 5);
		drawText(com.score, (3 * canvas.width) / 4, canvas.height / 5);
		drawNet();
		drawRect(user.x, user.y, user.width, user.height, user.color);
		drawRect(com.x, com.y, com.width, com.height, com.color);
		drawBall(ball.x, ball.y, ball.radius, ball.color);
	}

	// Game loop
	function gameLoop() {
		if (gameRunning) {
			render();
			update();
			requestAnimationFrame(gameLoop);
		}
	}

	// Mouse control
	useEffect(function () {
		function handleMouseMove(event) {
			let rect = canvas.getBoundingClientRect();
			user.y = event.clientY - rect.top - user.height / 2;
		}

		canvas.addEventListener("mousemove", handleMouseMove);

		return function () {
			canvas.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// Collision detection (b= ball and p= paddle)
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

	// Reset the Ball
	function resetBall() {
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.velocityX = -ball.velocityX;
		ball.speed = 7;

		if (com.score >= 5) {
			// Computer wins
			gameOver(false);
			return;
		}

		if (user.score >= 5) {
			// User wins, increase level and reset scores
			setCurrentLevel(currentLevel + 1);
			user.score = 0;
			com.score = 0;
			setGameDifficulty(currentLevel + 1);
		}
	}

	// Pause the game
	function pauseGame() {
		gameRunning = false;
		// document.getElementById("tennis-pause-menu").classList.remove("hidden");
	}

	// Resume the game
	function resumeGame() {
		gameRunning = true;
		gameLoop();
		// document.getElementById("tennis-pause-menu").classList.add("hidden");
	}

	// Restart the game
	function restartGame() {
		resetBall();
		gameRunning = true;
		gameLoop();

	}

	// Quit the game
	function quitGame() {
		gameRunning = false;
		// document.getElementById("tennis-pause-menu").classList.add("hidden");
		resetBall();
	}

	// Change of Speed
	function changeSpeed() {
		let speedSelect = document.getElementById("speedSelect");
		ball.speed = parseInt(speedSelect.value);
	}

	// setGameDifficulty(level)***

	function setGameDifficulty(level) {
		// Adjust the base speed and add an additional speed increment per level
		const baseSpeed = 7;
		const speedIncrement = 2;
		ball.speed = baseSpeed + (level - 1) * speedIncrement;
	}

	function update() {
		if (ball.x - ball.radius < 0) {
			com.score++;
			resetBall();
		} else if (ball.x + ball.radius > canvas.width) {
			user.score++;
			resetBall();
		}

		ball.x += ball.velocityX;
		ball.y += ball.velocityY;

		com.y += (ball.y - (com.y + com.height / 2)) * 0.04;

		if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
			ball.velocityY = -ball.velocityY;
		}

		let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

		if (collision(ball, player)) {
			let collidePoint = ball.y - (player.y + player.height / 2);
			collidePoint = collidePoint / (player.height / 2);
			let angleRad = (Math.PI / 4) * collidePoint;
			let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
			ball.velocityX = direction * ball.speed * Math.cos(angleRad);
			ball.velocityY = ball.speed * Math.sin(angleRad);
			ball.speed += 0.1;
		}
		setGameDifficulty(currentLevel);
	}

	// ***   ***
	function gameOver(winner) {
		const message = winner
			? "Game Over! You win!"
			: "Game Over! Computer wins!";
		const confirmRestart = window.confirm(message + " Restart?");

		if (confirmRestart) {
			// Reset game state
			user.score = 0;
			com.score = 0;
			setCurrentLevel(1);
			resetBall();
		}
	}

	return (
		<>
			<div className="page">
				<main>
					<header>
						<Navbar />
					</header>
					<div className="tennis-title">Tennis</div>
					<div id="tutorial" className="tennis-intro">
						<h1>How to Play</h1>
						<p>
							Use your mouse to move the left paddle and hit the ball back and
							forth.
						</p>
						<p>Be the first to score 5 points to win the game.</p>
						<p>Click Start Game to begin playing.</p>
					</div>
					<div>
						<div id="tennis-button-container" className="game-btn">
							<button onClick={startGame}>Start Game</button>
							<button onClick={pauseGame}>Pause Game</button>

							<div id="tennis-pause-menu" className="hidden">
								<h1 className="pause-menu-title">Game Paused</h1>
								<button className="tennis-pause-menu-btn" onClick={resumeGame}>
									Resume Game
								</button>
								<button className="tennis-pause-menu-btn" onClick={restartGame}>
									Restart Game
								</button>
								<button className="tennis-pause-menu-btn" onClick={quitGame}>
									Quit Game
								</button>
							</div>

							<select
								id="speedSelect"
								className="speed-btn"
								onChange={changeSpeed}
							>
								<option value="7">Normal</option>
								<option value="14">Fast</option>
								<option value="5">Slow</option>
							</select>
						</div>

						<canvas id="tennis-canvas"></canvas>
					</div>
					<Footer />
				</main>
			</div>
		</>
	);
}

export default TennisPage;
