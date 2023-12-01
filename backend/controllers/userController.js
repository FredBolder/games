import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

//@desc     Login user/set token
//route     POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc     Register a new user
//route     POST /api/users/register
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, userName, email, password, password2 } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(200).send("User already exists");
    return;
    //throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    userName,
    email,
    password,
    password2,
  });

  if (user) {
    // generateToken(res, user._id);
    // res.status(201).json({
    //   _id: user._id,
    //   firstName: user.firstName,
    //   userName: user.userName,
    //   email: user.email,
    // });
    res.sendStatus(201);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc     logout user
//route     POST /api/users/logout
//@access   Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

//@desc     Get user profile
//route     GET /api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    userName: req.user.userName,
    email: req.user.email,
  };

  res.status(200).json(user);
});

//@desc     Update user profile
//route     PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.userName = req.body.userName || user.userName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      userName: updatedUser.userName,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     Add completed level
//route     POST /api/users/bal/addcompleted
//@access   Private
const addLevel = asyncHandler(async (req, res) => {
  let levels = [];
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.balLevels) {
      user.balLevels = "";
    }
    if (user.balLevels === "") {
      levels = [];
    } else {
      levels = user.balLevels.split(",");
    }
    if (!levels.includes(req.body.level)) {
      levels.push(req.body.level);
      user.balLevels = levels.join(",");
    }
    const updatedUser = await user.save();
    res.status(200).json({
      balLevels: updatedUser.balLevels,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     Get completed levels
//route     GET /api/users/bal/getcompleted
//@access   Private
const getLevels = asyncHandler(async (req, res) => {
  let levels = [];
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.balLevels) {
      user.balLevels = "";
    }
    res.status(200).json({
      balLevels: user.balLevels,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     Set last played level
//route     POST /api/users/bal/setlast
//@access   Private
const setLast = asyncHandler(async (req, res) => {
  let levels = [];
  const user = await User.findById(req.user._id);

  if (user) {
    user.balLastPlayed = req.body.level;
    const updatedUser = await user.save();
    res.status(200).json({
      balLastPlayed: updatedUser.balLastPlayed,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     get last played level
//route     GET /api/users/bal/getlast
//@access   Private
const getLast = asyncHandler(async (req, res) => {
  let levels = [];
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.balLastPlayed) {
      user.balLastPlayed = "";
    }
    res.status(200).json({
      balLastPlayed: user.balLastPlayed,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     Save settings
//route     POST /api/users/bal/savesettings
//@access   Private
const saveSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.balSettings = req.body.balSettings;
    const updatedUser = await user.save();
    res.status(200).json({
      balSettings: updatedUser.balSettings,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc     Load settings
//route     GET /api/users/bal/loadsettings
//@access   Private
const loadSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (!user.balSettings) {
      user.balSettings = JSON.stringify({ sound: false, nicerGraphics: false });
    }
    res.status(200).json({
      balSettings: user.balSettings,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  addLevel,
  getLevels,
  setLast,
  getLast,
  saveSettings,
  loadSettings,
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
