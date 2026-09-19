import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from './models/User.js';
import authMiddleware from './middleware/auth.middleware.js';
const app = express();
app.use(express.json());
const PORT = 8080;
const JWT_SECRET = "mySecretKey123";
const startServer = async ()=>{
  await mongoose.connect(`${process.env.MONGO_URI}`);
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
  })
}
startServer();
app.get("/",(req,res) => {
  res.status(200).json({
    message : "API is running..."
  })
})
app.post("/api/v1/signup", async (req,res) => {
  const {username, email, password} = req.body;
  if(!username || !email || !password){
    return res.status(411).json({
      success : false,
      message : "All fields are required.."
    })
  }
  const hashedPassword = await bcrypt.hash(password,5);
  const user = await User.create({
    username,
    email,
    password:hashedPassword,
  });
  res.status(200).json({
    success : true,
    message : "User Created Successfully..",
    user
  })
})
app.post("/api/v1/signin", async (req,res) => {
   
  const {username , password} = req.body;

  if(!username || !password){
    return res.status(411).json({
      success : "false",
      message : "Both Feilds required.."
    })
  }
   const user = await User.findOne({
    username
  });
    if(!user){
    return res.status(403).json({
      success : false,
      message : "User not exists.."
    })
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(400).json({
      success : false,
      message : "Wrong Password!"
    })
  }
  const token = await jwt.sign({username:user.username,email:user.email},JWT_SECRET);
  res.status(200).json({
    success : true,
    message : "You are logged in..",
    user,
    token
  });
})
app.post("/api/v1/content", (req,res) => {
})
app.use(authMiddleware);
app.get("/api/v1/content", (req,res) => {
  res.status(200).json({
    success : true,
    message : "Middleware is Working.."
  })
})
app.delete("/api/v1/content", (req,res) => {
})
app.post("/api/v1/brain/share", (req,res) => {
})
app.get("/api/v1/brain/:shareLink", (req,res) => {
})
