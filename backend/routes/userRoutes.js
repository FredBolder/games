import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addLevel,
  getLevels,
  setLast,
  getLast,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post("/bal/addcompleted", protect, addLevel);
router.get("/bal/getcompleted", protect, getLevels);
router.post("/bal/setlast", protect, setLast);
router.get("/bal/getlast", protect, getLast);

export default router;
