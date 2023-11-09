import express from "express";
import { initLevel } from "../controllers/balController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/initlevel", initLevel);

export default router;
