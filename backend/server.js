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
import {fileURLToPath} from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({origin: "https://games-frontend.onrender.com"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("./frontend/dist/")))

app.use(cookieParser())

app.use("/api/users", userRoutes);
app.use("/api/bal", balRoutes);

app.get("/", (req, res) => {
  //res.send("Server is ready");
  //res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));

  let filePath = "./frontend/dist/index.html"
  let resolvedPath = path.resolve(filePath);
  console.log(resolvedPath);
  res.sendFile(resolvedPath);
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
