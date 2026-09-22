import dotenv from 'dotenv';

import type { Request, Response } from "express";
import User from "../models/User.js";
export const me = async (req : Request,res : Response) => {
  try{
     const id = req.user?.userId;
     if(!id){
      return res.status(411).json({
        success : false,
        message : "You're not logged In.."
      })
     }
     const user = await User.findById(id);
     if(!user){
      return res.status(411).json({
        success : false,
        message : "User not found.."
      })
     }
     res.status(200).json({
      success : true,
      message : "User Data Returned Successfully",
      userDetail : {
      username : user.username,
      email : user.email
      },
     })
  }catch(e){
    console.log("User End Error:",e);
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}