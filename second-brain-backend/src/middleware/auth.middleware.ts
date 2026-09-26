import dotenv from "dotenv";
dotenv.config();
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
  throw new Error("JWT_SECRET not configured!")
}
interface AuthUser {
  userId : string,
  email : string,
}
const authMiddleware = (req : Request,res : Response,next : NextFunction) => {
      
       const authHeader = req.headers.authorization;
       if(!authHeader){
        return res.status(400).json({
          success: false,
          message : "AuthHeader is Missing.."
        })
       }
       const [type , token] = authHeader.split(' ');
      
       if(type !== 'Bearer' || !token){
          return res.status(400).json({
          success : false,
          message : "Bearer Token Not Found.."
          })
       }
       try{
       const decodedData = jwt.verify(token,JWT_SECRET) as AuthUser;
       if(!decodedData){
        return res.status(400).json({
          success : false,
          message : "You're not logged in.."
        })
       }
       req.user = decodedData;
       console.log(req.user);
       next();

  }catch(error){
     //Error Handling in TypeScript
    if (error instanceof Error && (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")){
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
    console.error("Some Error in Middleware", error);
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}

export default authMiddleware;