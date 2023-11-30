import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import balRoutes from "./routes/balRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

if (process.env.NODE_ENV === "development") {
  console.log("CORS FOR DEVELOPMENT");
  app.use(cors());
} else {
  console.log("CORS FOR PUBLISHING");
  app.use(cors({ origin: ['https://games-41ql.onrender.com/', "http://localhost:5173/", "http://localhost:5000/"], credentials: true }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.resolve("../frontend/dist/")));
} else {
  app.use(express.static(path.resolve("./frontend/dist/")));
}

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/bal", balRoutes);

if (process.env.NODE_ENV === "development") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("../frontend/dist/index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("./frontend/dist/index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
