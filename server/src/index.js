import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@recipes.8stwf.mongodb.net/recipes`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => {
  console.log("SERVER STARTED!");
});

//
