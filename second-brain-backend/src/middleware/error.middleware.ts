import type { Request ,Response, NextFunction} from "express";

export const errorMiddleware = (error : any , req : Request,res : Response,next : NextFunction) => {
      
    console.log(error);
    if(res.headersSent){
      return next(error);
    }
    if(error?.code === 11000){
      const field = Object.keys(error.keyValue || {})[0];
      return res.status(409).json({
        success : false,
        message : `${field} already exists`
      });
    }
    return res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })

}