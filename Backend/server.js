import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use("/api", imageRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
