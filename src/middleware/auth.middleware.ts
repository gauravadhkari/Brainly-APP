import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET = "mySecretKey123";
interface AuthUser {
  userId : string,
  email : string,
}
interface AuthRequest extends Request {
  user?: AuthUser;
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

  }catch(err){
    console.error("Some Error in Middleware",err);
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}

export default authMiddleware;