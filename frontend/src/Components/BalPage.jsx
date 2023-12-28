import React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InfoContext from "../Context/InfoContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
// https://www.npmjs.com/package/react-confirm-alert
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
import drawLevel from "../drawLevel.js";
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
gameInfo.teleports = [];
gameInfo.ladders = [];
let gameInterval;
let gameOver = false;
let laserX1 = -1;
let laserX2 = -1;
let laserY = -1;
let nextButton = false;
let posX = -1;
let posY = -1;
let settings = { sound: true, nicerGraphics: true };
let skipFalling = 0;
let teleporting = 0;
let yellowCounter = 0;

function BalPage() {
  const [green, setGreen] = useState(0);
  const [levelNumber, setLevelNumber] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { loggedIn } = useContext(InfoContext);
  const navigate = useNavigate();

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
        case "teleport":
          snd = sndTeleport;
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

  function gameScheduler() {
    let info = {};
    let update = false;

    if (!gameOver && gameData) {
      if (skipFalling <= 0) {
        info = checkFalling(gameData, gameInfo);
        if (info.ballX !== -1) {
          posX = info.ballX;
          posY = info.ballY;
        }
        if (info.update) {
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
        if (gameInfo.horizontalElevators.length > 0) {
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

      if (gameInfo.teleports.length === 2) {
        switch (teleporting) {
          case 1:
            playSound("teleport");
            teleporting = 2;
            break;
          case 2:
            gameData[posY][posX] = 31;
            if (
              posX === gameInfo.teleports[0].x &&
              posY === gameInfo.teleports[0].y
            ) {
              posX = gameInfo.teleports[1].x;
              posY = gameInfo.teleports[1].y;
            } else {
              posX = gameInfo.teleports[0].x;
              posY = gameInfo.teleports[0].y;
            }
            gameData[posY][posX] = 2;
            update = true;
            teleporting = 0;
            break;
          default:
            break;
        }
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
      posX = gameInfo.blueBall.x;
      posY = gameInfo.blueBall.y;
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

  function clickSeriesSmall(e) {
    confirmAlert({
      title: "Question",
      message: "Load the first level of series Small?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            currentLevel = 750;
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

    if (gameOver || !canvas || teleporting > 0) {
      return false;
    }
    //console.log(posX, posY, gameData.length);
    if (posX === -1 || posY === -1 || gameData.length === 0) {
      return false;
    }
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
    }
    if (e.shiftKey) {
      switch (e.key) {
        case "N":
          // TODO: only for test, remove later
          currentLevel++;
          initLevel(currentLevel);
          break;
        case "ArrowLeft":
          info = jumpLeft(gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "ArrowRight":
          info = jumpRight(gameData, posX, posY, gameInfo);
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
          info = moveLeft(gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            if (info.oneDirection) {
              posX--;
            }
          }
          if (info.teleporting) {
            teleporting = 1;
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case "6":
          info = moveRight(gameData, posX, posY, gameInfo);
          if (info.player) {
            posX++;
            if (info.oneDirection) {
              posX++;
            }
          }
          if (info.teleporting) {
            teleporting = 1;
          }
          break;
        case "ArrowUp":
        case "w":
        case "W":
        case "8":
          info = jump(gameData, posX, posY, gameInfo);
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
          info = jumpLeft(gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "e":
        case "E":
        case "9":
          info = jumpRight(gameData, posX, posY, gameInfo);
          if (info.player) {
            posX++;
            posY--;
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "2":
          info = pushDown(gameData, posX, posY, gameInfo);
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
    if (loggedIn) {
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
    } else {
      navigate("/login");
    }
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
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    ctx = canvas.getContext("2d");
    //console.log("gameData: ", gameData);
    const elements = {
      elementGreen: elementGreen,
      elementHappy: elementHappy,
      elementLightBlue: elementLightBlue,
      elementPurple: elementPurple,
      elementRed: elementRed,
      elementSad: elementSad,
      elementWhite: elementWhite,
      elementYellow: elementYellow,
    };
    const status = {
      gameOver: gameOver,
      laserX1: laserX1,
      laserX2: laserX2,
      laserY: laserY,
    };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLevel(
      canvas,
      ctx,
      gameData,
      settings.nicerGraphics,
      elements,
      status,
      gameInfo
    );
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

  function putBallPosition(e) {
    if (e.altKey && e.shiftKey && e.ctrlKey) {
      if (!gameData || gameData.length < 1 || !canvas) {
        return false;
      }
      const rows = gameData.length;
      const columns = gameData[0].length;

      let size1 = canvas.width / columns;
      let size2 = canvas.height / rows;

      if (size2 < size1) {
        size1 = size2;
      }
      size1 = Math.trunc(size1);
      let gameWidth = columns * size1;
      let gameHeight = rows * size1;
      let leftMargin = Math.trunc((canvas.width - gameWidth) / 2);

      let rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left - leftMargin;
      let y = e.clientY - rect.top;

      let squareX = Math.floor(x / size1);
      let squareY = Math.floor(y / size1);

      if (squareX >= 0 && squareX < columns && squareY >= 0 && squareY < rows) {
        if (gameData[squareY][squareX] === 0) {
          gameData[posY][posX] = 0;
          posX = squareX;
          posY = squareY;
          gameData[posY][posX] = 2;
          updateScreen();
        }
      }
    }
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
              <div onClick={clickSeriesSmall}>
                <label>Series Small</label>
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
          <canvas className="gameCanvas" onClick={putBallPosition}></canvas>
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
