import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET = "mySecretKey123";
const authMiddleware = async(req : Request,res : Response,next : NextFunction) => {
  try {
       const authHeader = req.headers['authorization'];

       if(!authHeader){
        return res.status(400).json({
          success: false,
          message : "AuthHeader is Missing.."
        })
       }
       if(typeof authHeader !== 'string'){
           return res.status(400).json({
            success : false,
            message : "AuthHeader Must be a String."
           })
       }
       const [type , token] = authHeader.split(' ');
       if(type !== 'Bearer' || !token){
          return res.status(400).json({
          success : false,
          message : "Bearer Token Not Found.."
          })
       }

       const decodedData = await jwt.verify(token,JWT_SECRET);
       if(!decodedData){
        return res.status(400).json({
          success : false,
          message : "You're not logged in.."
        })
       }
       next();

  }catch(err){
    console.error("Some Error in Middleware",err);
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}

export default authMiddleware;