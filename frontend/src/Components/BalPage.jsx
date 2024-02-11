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
  moveDownLeft,
  moveDownRight,
  checkDetonator,
  rotateGame,
  moveFish,
  electricityTarget,
  inWater,
  checkTrapDoors,
} from "../balUtils.js";
import drawLevel from "../drawLevel.js";
import sndCatapult from "../Sounds/catapult.wav";
import sndEat1 from "../Sounds/eat1.wav";
import sndEat2 from "../Sounds/eat2.wav";
import sndEat3 from "../Sounds/eat3.wav";
import sndEat4 from "../Sounds/eat4.wav";
import sndElectricity from "../Sounds/electricity.wav";
import sndExplosion from "../Sounds/explosion.wav";
import sndFloor1 from "../Sounds/floor1.wav";
import sndFloor2 from "../Sounds/floor2.wav";
import sndKey from "../Sounds/key.wav";
import sndLaserGun from "../Sounds/laser_gun.wav";
import sndPain from "../Sounds/pain.wav";
import sndPickaxe from "../Sounds/pickaxe.wav";
import sndSplash1 from "../Sounds/splash1.wav";
import sndSplash2 from "../Sounds/splash2.wav";
import sndTake from "../Sounds/take.wav";
import sndTeleport from "../Sounds/teleport.wav";
import sndTrapDoor from "../Sounds/trap_door.wav";
import sndUnlock from "../Sounds/unlock.wav";
import imgBlueHappy from "../Images/blue_ball_happy.svg";
import imgBlueSad from "../Images/blue_ball_sad.svg";
import imgBlueDiving from "../Images/blue_ball_with_diving_glasses.svg";
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
let cbQuestions = null;
let cbSound = null;
let completed = [];
let ctx;
let currentLevel = 200;
let fishCounter = 0;
let fishCountTo = 12;
let elecActiveSaved = false;
let electricityCounter = 0;
let elementDiving;
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
let backData = [];
let gameData = [];
let gameInfo = {};
gameInfo.elevators = [];
gameInfo.horizontalElevators = [];
gameInfo.greenBalls = 0;
gameInfo.redBalls = [];
gameInfo.yellowBalls = [];
gameInfo.detonator = { x: -1, y: -1 };
gameInfo.teleports = [];
gameInfo.hasWater = false;
gameInfo.hasDivingGlasses = false;
gameInfo.redFish = [];
gameInfo.electricity = [];
gameInfo.electricityActive = false;
gameInfo.trapDoors = [];
let gameInterval;
let gameOver = false;
let giveUp = [];
let laserX1 = -1;
let laserX2 = -1;
let laserY = -1;
let nextButton = false;
let posX = -1;
let posY = -1;
let settings = { sound: true, nicerGraphics: true, lessQuestions: false };
let skipFalling = 0;
let teleporting = 0;
let wave1 = 0;
let wave2 = 0;
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
    if (giveUp.includes(level)) {
      giveUp = giveUp.filter((value) => {
        return level !== value;
      });
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
    } catch (error) {
      alert(error);
    }
  }

  async function getGiveUp() {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BE_URL}/api/users/bal/getgiveup`,
        { withCredentials: credentials() }
      );
      const balGiveUp = response.data.balGiveUp;
      if (balGiveUp === "") {
        giveUp = [];
      } else {
        giveUp = balGiveUp.split(",");
      }
      //alert(giveUp.toString());
    } catch (error) {
      alert(error);
    }
  }

  async function giveUpLevel(n) {
    let msg = "";
    let level = n.toString();

    if (
      !completed.includes(level) &&
      !giveUp.includes(level) &&
      giveUp.length >= 3
    ) {
      msg =
        "You have already given up too many levels. Try first to solve a level that you have given up.";
    }
    if (msg === "" && !completed.includes(level) && !giveUp.includes(level)) {
      giveUp.push(level);
      try {
        let response = await axios.post(
          `${import.meta.env.VITE_BE_URL}/api/users/bal/giveup`,
          { level: level },
          { withCredentials: credentials() }
        );
      } catch (error) {
        msg = error;
      }
    }
    if (msg === "") {
      initLevel(currentLevel + 1);
    } else {
      alert(msg);
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
                initLevel(level);
              },
            },
            {
              label: "No",
              onClick: () => {
                updateScreen();
              },
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
      if (!balSettings.hasOwnProperty("lessQuestions")) {
        balSettings.lessQuestions = false;
      }
      if (!balSettings.hasOwnProperty("nicerGraphics")) {
        balSettings.nicerGraphics = false;
      }
      if (!balSettings.hasOwnProperty("sound")) {
        balSettings.sound = false;
      }
      settings.lessQuestions = balSettings.lessQuestions;
      settings.nicerGraphics = balSettings.nicerGraphics;
      settings.sound = balSettings.sound;
      if (cbQuestions !== null) {
        cbQuestions.checked = settings.lessQuestions;
      }
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
    let level = currentLevel.toString();
    nextButton = completed.includes(level) || giveUp.includes(level);
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
        case "electricity":
          snd = sndElectricity;
          break;
        case "explosion":
          snd = sndExplosion;
          break;
        case "laser":
          snd = sndLaserGun;
          break;
        case "splash1":
          snd = sndSplash1;
          break;
        case "splash2":
          snd = sndSplash2;
          break;
        case "take":
          snd = sndTake;
          break;
        case "teleport":
          snd = sndTeleport;
          break;
        case "trap":
          snd = sndTrapDoor;
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
    let target = -1;

    if (
      !gameOver &&
      gameInfo.electricity.length > 0 &&
      gameInfo.electricityActive
    ) {
      for (let i = 0; i < gameInfo.electricity.length; i++) {
        const elec = gameInfo.electricity[i];
        target = electricityTarget(backData, gameData, elec.x, elec.y);
        if (target > 0) {
          if (gameData[target][elec.x] === 2) {
            gameOver = true;
          }
          if (
            backData[target][elec.x] === 20 ||
            backData[target][elec.x] === 23
          ) {
            if (inWater(posX, posY, backData)) {
              gameOver = true;
            }
            for (let j = 0; j < gameInfo.redFish.length; j++) {
              const fish = gameInfo.redFish[j];
              fish.isDead = true;
            }
          }
        }
      }
    }
    if (!gameOver) {
      let redInfo = checkRed(gameData, posX, posY, gameInfo.redBalls);
      if (redInfo.hit) {
        gameOver = true;
        laserX1 = redInfo.x1;
        laserX2 = redInfo.x2;
        laserY = redInfo.y;
        playSound("laser");
      }
    }
    if (!gameOver && gameInfo.hasWater && !gameInfo.hasDivingGlasses) {
      if (backData[posY][posX] === 20 || backData[posY][posX] === 23) {
        gameOver = true;
      }
    }
    if (!gameOver && gameInfo.redFish.length > 0) {
      for (let i = 0; i < gameInfo.redFish.length && !gameOver; i++) {
        const fish = gameInfo.redFish[i];
        if (
          !fish.isDead &&
          Math.abs(posX - fish.x) < 2 &&
          Math.abs(posY - fish.y) < 2
        ) {
          gameOver = true;
        }
      }
    }
    if (gameOver) {
      updateScreen();
    }
  }

  function gameScheduler() {
    let info = {};
    let update = false;

    if (!gameOver && gameData && backData) {
      info = checkTrapDoors(gameData, gameInfo);
      if (info.sound) {
        playSound("trap");
      }
      if (info.updated) {
        update = true;
      }

      if (skipFalling <= 0) {
        info = checkFalling(backData, gameData, gameInfo);
        if (info.ballX !== -1) {
          posX = info.ballX;
          posY = info.ballY;
        }
        if (info.update) {
          update = true;
        }
        if (info.sound === 1) {
          playSound("splash1");
        }
      } else {
        skipFalling--;
      }

      if (gameInfo.redFish.length > 0) {
        fishCounter = fishCounter + 1;
        if (fishCounter >= fishCountTo) {
          fishCounter = 0;
          moveFish(backData, gameData, gameInfo, posX, posY);
          update = true;
        }
      }

      if (gameInfo.hasWater) {
        wave1++;
        if (wave1 > 5) {
          wave1 = 1;
          wave2++;
          if (wave2 > 3) {
            wave2 = 1;
          }
          update = true;
        }
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
        if (moveYellowBalls(gameData, gameInfo.yellowBalls)) {
          update = true;
        }
      }

      if (explosionCounter > 0) {
        explosionCounter--;
      } else {
        explosionCounter = 2;
        info = checkDetonator(
          gameData,
          gameInfo.detonator.x,
          gameInfo.detonator.y
        );
        if (info.explosion) {
          playSound("explosion");
        }
        if (info.updated) {
          update = true;
        }
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

      if (gameInfo.electricity.length > 0) {
        if (electricityCounter > 110) {
          electricityCounter = 0;
        }
        gameInfo.electricityActive = false;
        if (
          (electricityCounter > 50 && electricityCounter < 60) ||
          (electricityCounter > 90 && electricityCounter < 100)
        ) {
          gameInfo.electricityActive = true;
        }
        if (!elecActiveSaved && gameInfo.electricityActive) {
          playSound("electricity");
        }
        if (
          gameInfo.electricityActive ||
          elecActiveSaved !== gameInfo.electricityActive
        ) {
          update = true;
        }
        elecActiveSaved = gameInfo.electricityActive;
        electricityCounter++;
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
    let gd;

    try {
      currentLevel = n;
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
      gd = stringArrayToNumberArray(data);
      backData = gd.backData;
      gameData = gd.gameData;
      laserX1 = -1;
      laserX2 = -1;
      laserY = -1;
      gameOver = false;
      updateScreen();
      gameInfo = getGameInfo(backData, gameData);
      updateScreen();
      posX = gameInfo.blueBall.x;
      posY = gameInfo.blueBall.y;
      setGreen(gameInfo.greenBalls);
    } catch (err) {
      console.log(err);
    }
  }

  function clickSeries1(e) {
    if (settings.lessQuestions) {
      initLevel(200);
    } else {
      confirmAlert({
        title: "Question",
        message: "Load the first level of series 1?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              initLevel(200);
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    }
  }

  function clickSeries2(e) {
    if (settings.lessQuestions) {
      initLevel(700);
    } else {
      confirmAlert({
        title: "Question",
        message: "Load the first level of series 2?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              initLevel(700);
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    }
  }

  function clickSeriesSmall(e) {
    if (settings.lessQuestions) {
      initLevel(750);
    } else {
      confirmAlert({
        title: "Question",
        message: "Load the first level of series Small?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              initLevel(750);
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    }
  }

  function giveUpClick(e) {
    confirmAlert({
      title: "Question",
      message: "Give up this level?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            giveUpLevel(currentLevel);
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
    settings.lessQuestions = cbQuestions.checked;
    settings.nicerGraphics = cbGraphics.checked;
    settings.sound = cbSound.checked;
    saveSettings();
  }

  function handleKeyDown(e) {
    let info = {};
    info.player = false;
    info.eating = false;
    info.rotate = false;
    let rotate = false;

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
          if (e.altKey) {
            initLevel(currentLevel + 1);
          }
          break;
        case "P":
          if (e.altKey) {
            initLevel(currentLevel - 1);
          }
          break;
        case "ArrowLeft":
          info = jumpLeft(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "ArrowRight":
          info = jumpRight(backData, gameData, posX, posY, gameInfo);
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
          info = moveLeft(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            if (info.oneDirection) {
              posX--;
            }
            if (info.rotate) {
              posX--;
              gameInfo.blueBall.x = posX;
              gameInfo.blueBall.y = posY;
              rotate = rotateGame(backData, gameData, gameInfo);
              posX = gameInfo.blueBall.x;
              posY = gameInfo.blueBall.y;
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
          info = moveRight(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posX++;
            if (info.oneDirection) {
              posX++;
            }
            if (info.rotate) {
              posX++;
              gameInfo.blueBall.x = posX;
              gameInfo.blueBall.y = posY;
              rotate = rotateGame(backData, gameData, gameInfo);
              posX = gameInfo.blueBall.x;
              posY = gameInfo.blueBall.y;
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
          info = jump(backData, gameData, posX, posY, gameInfo);
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
          info = jumpLeft(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posX--;
            posY--;
          }
          break;
        case "e":
        case "E":
        case "9":
          info = jumpRight(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posX++;
            posY--;
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "2":
          info = pushDown(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posY++;
            if (info.oneDirection) {
              posY++;
            }
          }
          break;
        case "y":
        case "Y":
        case "1":
          info = moveDownLeft(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posY++;
            posX--;
          }
          break;
        case "c":
        case "C":
        case "3":
          info = moveDownRight(backData, gameData, posX, posY, gameInfo);
          if (info.player) {
            posY++;
            posX++;
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
    if (!info.hasOwnProperty("eating")) {
      info.eating = false;
    }
    if (!info.hasOwnProperty("divingGlasses")) {
      info.divingGlasses = false;
    }
    if (info.eating) {
      gameInfo.greenBalls--;
      setGreen(gameInfo.greenBalls);
      playSound("eat");
      checkGameOver();
      if (!gameOver && gameInfo.greenBalls <= 0) {
        addLevel(currentLevel);
        initLevel(currentLevel + 1);
      }
    }
    if (info.divingGlasses) {
      gameInfo.hasDivingGlasses = true;
      playSound("take");
    }
  }

  function handleResize(e) {
    updateScreen();
  }

  function nextLevelClick(e) {
    if (settings.lessQuestions) {
      initLevel(currentLevel + 1);
    } else {
      confirmAlert({
        title: "Question",
        message: "Load the next level?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              initLevel(currentLevel + 1);
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    }
  }

  function tryAgain(e) {
    if (settings.lessQuestions) {
      initLevel(currentLevel);
    } else {
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
  }

  const myRef = useRef(document);

  useEffect(() => {
    if (loggedIn) {
      elementDiving = document.getElementById("diving");
      elementHappy = document.getElementById("happy");
      elementSad = document.getElementById("sad");
      elementRed = document.getElementById("red");
      elementGreen = document.getElementById("green");
      elementLightBlue = document.getElementById("light_blue");
      elementPurple = document.getElementById("purple");
      elementWhite = document.getElementById("white");
      elementYellow = document.getElementById("yellow");

      getCompleted();
      getGiveUp();
      updateNextButton();
      initLevel(200, false);
      cbGraphics = document.getElementById("graphics");
      cbQuestions = document.getElementById("questions");
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
      elementDiving: elementDiving,
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
      backData,
      gameData,
      settings.nicerGraphics,
      elements,
      status,
      gameInfo,
      wave2
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
    <div>
      <div
        className="help"
        onClick={help}
        style={{ display: showHelp ? "inline" : "none" }}
      >
        <h2>Help</h2>
        <p>
          In every level you control the blue ball with the happy face. You have
          to eat all the little green balls. You can push the white balls and
          the light blue balls, but not more than 2 at the same time. The light
          blue balls are floating balls and they will always stay at the same
          height. Red balls are very dangerous. If you push a yellow ball, it
          will continue as far as possible. You cannot push more yellow balls at
          the same time or push a yellow ball together with another ball. You
          can push a yellow ball in the directions left, right, up and down. A
          purple ball is almost the same as a yellow ball, but when you push a
          purple ball, it will go only one position further. You cannot push a
          ball through a one direction, a teleport, a game rotator or a door
          with a lock. You can control the blue ball with the letter keys, the
          arrow keys, the number keys or the arrow buttons. In the water you can
          swim in every direction. If you see for example a level number 750, it
          doesn't mean that there are 750 or even more levels. The number
          depends also on the series and on the&nbsp;
          <a
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://fredbolder.github.io/bal/"
          >
            original Bal game
          </a>
          .
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
              <td>Walk left / Swim left</td>
              <td>A</td>
              <td>Arrow left</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Walk right / Swim right</td>
              <td>D</td>
              <td>Arrow right</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Jump / Push up / Swim up</td>
              <td>W</td>
              <td>Arrow up</td>
              <td>8</td>
            </tr>
            <tr>
              <td>Jump left / Swim up left</td>
              <td>Q</td>
              <td>Shift + Arrow left</td>
              <td>7</td>
            </tr>
            <tr>
              <td>Jump right / Swim up right</td>
              <td>E</td>
              <td>Shift + Arrow right</td>
              <td>9</td>
            </tr>
            <tr>
              <td>Push down / Swim down</td>
              <td>S</td>
              <td>Arrow down</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Swim down left</td>
              <td>Y</td>
              <td>-</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Swim down right</td>
              <td>C</td>
              <td>-</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
        <p>
          If you have already solved a certain level before, there is a Next
          button available to continue with the next level. Some levels are very
          difficult. If you can't solve a certain level, you can start with
          another series or press the Give up button to continue with the next
          level. Of course, you can't give up on too many levels.
        </p>
        <p className="bold topmargin">
          You can click on this screen to close it.
        </p>
      </div>
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
            <button className="balButton" onClick={giveUpClick}>
              Give up
            </button>
            <div className="balPanelText">
              Green: <span className="balPanelTextSpan">{green}</span>
            </div>

            <button className="balButton" onClick={help}>
              ?
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
                <div>
                  <input
                    type="checkbox"
                    id="questions"
                    name="questions"
                    value="questions"
                    onChange={handleChangeSettings}
                  />
                  <label for="questions">Less questions</label>
                </div>
              </div>
            </div>
          </div>
          <canvas className="gameCanvas" onClick={putBallPosition}></canvas>
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
            <img id="diving" src={imgBlueDiving} />
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
    </div>
  );
}

export default BalPage;
