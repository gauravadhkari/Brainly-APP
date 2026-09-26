import dotenv from 'dotenv';

import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from '../validations/auth.validation.js';
import z from 'zod';
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET is not configured");
}
export const signup = async (req : Request,res : Response, next : NextFunction) => {
  try{
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
        success : false,
        message : "Validation failed!",
        errors: z.flattenError(result.error).fieldErrors
      })
    }
  const {username, email, password} = result.data;
  if(!username || !email || !password){
    return res.status(411).json({
      success : false,
      message : "All fields are required.."
    })
  }
  const isExisting = await User.findOne({email});
  if(isExisting){
    return res.status(409).json({
      success : false,
      message : "User Already Exist.."
    })
  }
  const hashedPassword = await bcrypt.hash(password,5);
  await User.create({
    username,
    email,
    password:hashedPassword,
  });
  res.status(201).json({
    success : true,
    message : "User Created Successfully..",
  })
}catch(error){
  console.log("SIGNUP Error :",error);
  next(error);
}
}
export const signin =  async (req : Request,res : Response, next : NextFunction) => {
  try{
    const result = loginSchema.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
        success : false,
        message : "Validation failed",
        errors: z.flattenError(result.error).fieldErrors
      })
    }
  const {username , password} = result.data;

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
    return res.status(404).json({
      success : false,
      message : "User not exists.."
    })
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(401).json({
      success : false,
      message : "Wrong Password!"
    })
  }
  const token = jwt.sign({userId : user._id,email :user.email},JWT_SECRET_KEY);
  res.status(200).json({
    success : true,
    message : "You are logged in..",
    token
  });
}catch(e){
  console.log("SIGNIN Error:",e);
  next(e);
}
}

