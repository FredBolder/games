import asyncHandler from "express-async-handler";
import {getLevel} from "../bal/levels.js";

//@desc     Init Level
//route     POST /api/bal/initLevel
//@access   Public
const initLevel = asyncHandler(async (req, res) => {
    let level = req.body.level;
    level = Number(level);
    let gameData = getLevel(level);

    res.status(201).json({
        gameData: gameData,
      });
  });

  export{
    initLevel
  }