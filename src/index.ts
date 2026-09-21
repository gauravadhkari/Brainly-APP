import dotenv from 'dotenv';
dotenv.config();
import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from './models/User.js';
import authMiddleware from './middleware/auth.middleware.js';
import { Content } from './models/Content.js';
import { Link } from './models/Link.js';
import { generateRandomString } from './utils.js';
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
app.get("/",(req : Request ,res : Response) => {
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
  const token = jwt.sign({userId : user._id,email :user.email},JWT_SECRET);
  res.status(200).json({
    success : true,
    message : "You are logged in..",
    user,
    token
  });
})
app.get("/api/v1/brain/:shareLink", async (req,res) => {

  const shareLink = req.params.shareLink;

  const userLink = await Link.findOne({hash : shareLink});
  if(!userLink){
    return res.status(404).json({
      success : false,
      message : "Shared link not found.."
    })
  }
  const id = userLink.userId;
  const content = await Content.find({userId : id});
  console.log(userLink);
  res.status(200).json({
    success: true,
    content,
  })
})
app.use(authMiddleware);

app.post("/api/v1/content", async (req : Request,res : Response) => {
  const {link,type,title,tags} = req.body;
  const userId = req.user?.userId;

  if(!userId){
    return res.status(400).json({
      success : false,
      message : "Unauthorized Access.."
    })
  }
  const content = await Content.create({
    link ,
    type ,
    title,
    userId,
    tags,
  })

  res.status(200).json({
    success : true,
    message : "Content Created Successfully",
    content
  })
})
app.get("/api/v1/content", async (req,res) => {
  
  const userId = req.user?.userId;
  console.log(userId);
  const content = await Content.find().populate({
    path : "userId",
    select : "username email"
  })
  res.status(200).json({
    success : true,
    message : "Get is running..",
    content
  })
})
app.delete("/api/v1/content", async (req,res) => {

  const contentId = req.body.id;

  const content = await Content.findByIdAndDelete(contentId);
  
  res.status(200).json({
    success : true,
    message : "Content Deleted",
    content,
  })
})
app.post("/api/v1/brain/share", async (req,res) => {

  const share = req.body.share;
  const userId = req.user?.userId;
  if(!userId){
    return res.status(400).json({
      success : false,
      message : "Unauthorized Access!"
    })
  }
  if(share){
    const existingLink = await Link.findOne({
      userId : userId
    })
    if(existingLink){
      return res.status(301).json({
        message : "Link Already exist",
        existingLink,
      })
    }
    const sharedLink = await Link.create({
      hash : generateRandomString(10),
      userId : userId,
    });
    return res.status(200).json({
    success : true,
    message : "Link Generated..",
    link : sharedLink,
  })
  }else {
    await Link.deleteOne({
      userId : userId,
    });
  }
  res.status(201).json({
    success : true,
  })
})

