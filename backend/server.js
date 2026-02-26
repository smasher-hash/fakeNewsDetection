import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import textRoutes from "./routes/textRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

 

const app = express();

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/text", textRoutes);
app.use("/api/image", imageRoutes);

app.use("/api/vote", voteRoutes);

app.get("/test", (req, res) => {
  res.send("Server working");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);