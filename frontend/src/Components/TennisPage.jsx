import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./TennisPage.css";

function TennisPage() {
	let canvas;
	let ctx;
	let runGame = false;
	let user;
	let ball;
	let com;
	let net;

	useEffect(() => {
		canvas = document.getElementById("tennis-canvas");
		canvas.width = 800;
		canvas.height = 500;
		ctx = canvas.getContext("2d");

		canvas.addEventListener("mousemove", paddleMovement);

		// Create the ball
		ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 10,
			velocityX: 5,
			velocityY: 5,
			speed: 6, //change speed
			color: "Yellow",
		};

		// Create the user and computer paddles
		user = {
			x: 0,
			y: (canvas.height - 100) / 2,
			width: 10,
			height: 100,
			color: "darkgray",
			score: 0,
		};

		com = {
			x: canvas.width - 10,
			y: (canvas.height - 100) / 2,
			width: 10,
			height: 100,
			color: "darkgray",
			score: 0,
		};

		net = {
			x: canvas.width / 2 - 2 / 2,
			y: 0,
			width: 2,
			height: 10,
			color: "WHITE",
		};
		return () => {
			removeEventListener("mousemove", paddleMovement);
			clearInterval(gameInterval);
		};
	}, []);

	// Other functions
	function drawRect(x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}

	// Draw the ball
	function drawBall(x, y, radius, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	}

	// Drawing of the net
	function drawNet() {
		for (let i = 0; i <= canvas.height; i += 14) {
			drawRect(net.x, net.y + i, net.width, net.height, net.color);
		}
	}

	// Score Text
	function drawText(text, x, y) {
		ctx.fillStyle = "White";
		ctx.font = "65px League Gothic"; //change font type
		ctx.fillText(text, x, y);
	}

	// Draw the game elements
	function render() {
		drawRect(0, 0, canvas.width, canvas.height, "darkgreen");
		drawText(user.score, canvas.width / 4, canvas.height / 8); //change score position for the user
		drawText(com.score, (3 * canvas.width) / 4, canvas.height / 8); //change score position for the computer
		drawNet();
		drawRect(user.x, user.y, user.width, user.height, user.color);
		drawRect(com.x, com.y, com.width, com.height, com.color);
		drawBall(ball.x, ball.y, ball.radius, ball.color);
	}
	let gameInterval;
	const framePerSecond = 60;
	gameInterval = setInterval(gameLoop, 1000 / framePerSecond);

	// Game loop
	function gameLoop() {
		if (runGame) {
			render();
			update();
		}

		// To Update the ball's velocity based on its current speed
		ball.velocityX = ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
	}

	// Mouse control
	function paddleMovement(event) {
		let rect = canvas.getBoundingClientRect();
		

		let mouseY = event.clientY - rect.top;

		let areaY = Math.min(
			Math.max(mouseY - user.height / 2, 0),
			canvas.height - user.height
		);

		user.y = areaY;
	}

	
	// Collision detection (b= ball and p= paddle)
	function collision(b, p) {
		p.top = p.y;
		p.bottom = p.y + p.height;
		p.left = p.x;
		p.right = p.x + p.width;
		// ball detection
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
		ball.speed = 6;

		if (com.score == 5) {
			// Computer wins
			gameOver(false);
			return;
		}

		if (user.score == 2) {
			// User wins, increase level and reset scores
			user.score = 0;
			com.score = 0;
			gameOver(true);
		}
	}

	// Add the startGame function
	function startGame() {
		runGame = true;
		gameLoop();
		document.getElementById("tutorial").classList.add("hidden");
	}

	// Pause the game
	function pauseGame() {
		runGame = false;
		document.getElementById("tennis-pause-menu").classList.remove("hidden");
	}

	// Resume the game
	function resumeGame() {
		runGame = true;
		document.getElementById("tennis-pause-menu").classList.add("hidden");
		gameLoop();
	}

	// Restart the game
	function restartGame() {
		runGame = true;
		document.getElementById("tennis-pause-menu").classList.add("hidden");
		resetBall();
		gameLoop();
	}

	// Quit the game
	function quitGame() {
		runGame = false;
		document.getElementById("tennis-pause-menu").classList.add("hidden");
		resetBall();
	}

	// Change of Speed
	function changeSpeed() {
		let speedSelect = document.getElementById("speedSelect");
		ball.speed = parseInt(speedSelect.value);
		gameLoop();
	}

	// Update the game elements
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

		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
			ball.velocityY = -ball.velocityY;
		}

		let computerLevel = 0.04; //change computer level
		com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

		let player = ball.x + ball.radius < canvas.width / 2 ? user : com;

		if (collision(ball, player)) {
			let collisionPoint = ball.y - (player.y + player.height / 2);
			collisionPoint = collisionPoint / (player.height / 2);

			let angleRad = collisionPoint * (Math.PI / 4);
			let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;

			ball.velocityX = direction * ball.speed * Math.cos(angleRad);
			ball.velocityY = ball.speed * Math.sin(angleRad);

			ball.speed += 0.4; // Increases the speed of the ball after each hit
		}
		// setGameDifficulty(currentLevel);
	}

	// Game over
	function gameOver(winner) {
		let message = winner
			? "Congratulations! You WIN!"
			: "Game Over! Computer Wins!";
		let confirmRestart = window.confirm(
			message + " Would you like to play again?"
		);

		if (confirmRestart) {
			// Reset game state
			user.score = 0;
			com.score = 0;

			resetBall();
		} else {
			runGame = false;
			document.getElementById("tennis-pause-menu").classList.remove("hidden");
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
						<h1>Instructions</h1>
						<p>Use your mouse to move the left paddle to hit the ball.</p>
						<p>The first to score 5 points, Wins the game.</p>
						<p>Click Start Game to play.</p>
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
