import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./TennisPage.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function TennisPage() {
	let canvas;
	let ctx;
	let runGame = false;
	let user;
	let ball;
	let com;
	let net;
	let winningScore = 5;
	let selectedSpeed = 6;

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
			speed: selectedSpeed,
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
			checkWinner();
			render();
			update();
		}

		// To Update the ball's velocity based on its current speed
		ball.velocityX = ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
	}

	// Mouse movement & paddle movement
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
		ball.speed = selectedSpeed;
	}

	function checkWinner() {
		if (com.score >= winningScore || user.score >= winningScore) {
			runGame = false;
			gameOver(user.score >= winningScore);
		}
	}

	// Add the startGame function
	function startGame() {
		runGame = true;
		ball.speed = selectedSpeed;
		// changeSpeed();
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
		// changeSpeed();
		ball.speed = selectedSpeed;
		gameLoop();
	}

	// Restart the game
	function restartGame() {
		runGame = false;
		document.getElementById("tennis-pause-menu").classList.add("hidden");
		ball.speed = selectedSpeed;
		// Reset the score
		user.score = 0;
		com.score = 0;

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
		selectedSpeed = parseInt(speedSelect.value);
		ball.speed = selectedSpeed;
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

		ball.speed = selectedSpeed;

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
	}

	// Game over
	function gameOver(userWins) {
		let msg = userWins
			? "Congratulations! You win!"
			: "Game Over! Computer wins.";
		msg += "\n\nWould you like to play again?";

		confirmAlert({
			title: "Information",
			message: msg,
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						user.score = 0;
						com.score = 0;
						resetBall();
					},
				},
				{
					label: "No",
					onClick: () => {
						// Quit the game
						runGame = false;
					},
				},
			],
		});
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
						<div className="tennis-directions">
							<p>
								Move the left paddle with your mouse to hit the ball. To win the
								game, get 5 points. To play, click Start Game.
							</p>
						</div>
					</div>
					<div>
						<div id="tennis-button-container" className="game-btn">
							<button onClick={startGame}>Start Game</button>
							<button onClick={pauseGame}>Pause Game</button>

							<div id="tennis-pause-menu" className="hidden">
								<h1 className="pause-menu-title">Game Paused</h1>
								<div className="pauseMenu-BtnContainer">
									<button
										className="tennis-pause-menu-btn"
										onClick={resumeGame}
									>
										Resume Game
									</button>
									<button
										className="tennis-pause-menu-btn"
										onClick={restartGame}
									>
										Restart Game
									</button>

									<button className="tennis-pause-menu-btn" onClick={quitGame}>
										Quit Game
									</button>
								</div>
							</div>
							<select
								id="speedSelect"
								className="speed-btn"
								onChange={changeSpeed}
							>
								<option value="6">Normal</option>
								<option value="10">Fast</option>
								<option value="3">Slow</option>
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
