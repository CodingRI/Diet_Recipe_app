import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
const router = express.Router();
import { UserModel } from "../models/Users.js";

dotenv.config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      message: "Authorization token required",
    });
  }

  try {
    const response = jwt.verify(token, process.env.JWT_SECRET);

    req.userID = response.id;
    next();
  } catch (error) {
    res.json.status(401).json({
      message: "Expired or invalid token",
    });
  }
};

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({
      message: "User already exists. ",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    username,
    password: hashedPassword,
  });
  await newUser.save();

  res.json({
    messeage: "User registered successfully!",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.json({
      message: "User doesn't exist!",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({
      message: "Incorrect password!",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({
    token,
    userID: user._id,
  });
});
export { router as userRouter };
