import type { Request, Response } from "express";
import { Content } from "../models/Content.js";
import { isValidObjectId } from "mongoose";


export const createContent = async (req : Request, res : Response) => {
   try{
       const {link , title, type , tags} = req.body;
       if(!link || !title || !type ){
          return res.status(400).json({
            success : false,
            message : "All fields are required.."
          });
       }
       const userId = req.user?.userId;
       if(!userId){
        return res.status(401).json({
          success : false,
          message : "You're not logged in.."
        })
       }
       await Content.create({
        link,
        type,
        title,
        tags,
        userId : userId,
       });
       res.status(201).json({
        success : true,
        message : "Content created Successfully.."
       });
   }catch(e){
      console.error("Content Adding Error:",e);

      res.status(500).json({
        success : false,
        message : "Internal Server Error.."
      });
   }
}

export const getContent = async (req : Request ,res : Response) => {
  try{
     const userId = req.user?.userId;
     if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged In.."
      })
     }
     const content = await Content.find({
      userId : userId
     });
     res.status(200).json({
      success : true,
      message : "Content Returned Successfully",
      content
     })
  }catch(e){
     console.error("Get Content Error:",e);
     res.status(500).json({
      success : false,
      message : "Internal Server Error"
     })
  }
}

export const getContentById = async(req : Request,res : Response) => {
  try{
     const userId = req.user?.userId;
     if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged in"
      })
     }
     const contentId = req.params.id;
     if(!isValidObjectId(contentId)){
      return res.status(400).json({
        success : false,
        message : "Not a valid object Id.."
      })
     }
     const content = await Content.findOne({
      _id : contentId,
      userId : userId
     }).populate("userId");
     if(!content){
      return res.status(404).json({
        success : false,
        message : "Content is no more in db"
      })
     }
     res.status(200).json({
      success : true,
      message : "Content found Successfully",
      content
     })
  }catch(e){
      console.error("Get content by id Error:",e);
      res.status(500).json({
        success : false,
        message : "Internal Server Error"
      })
  }
}

export const updateContent = async(req : Request,res : Response) => {
  try{
     const {link , title, type} = req.body;
     const userId = req.user?.userId;
     if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged in"
      })
     }
     const contentId = req.params.id;
     if(!isValidObjectId(contentId)){
       return res.status(400).json({
        success : false,
        message : "Not a valid object Id",
       })
     }
     const content = await Content.findOne({
      _id : contentId,
      userId : userId,
     });
     if(!content){
      return res.status(404).json({
        success : false,
        message : "Content not found in db"
      })
     }
     content.link = link || content.link;
     content.title = title || content.title;
     content.type = type || content.type;
     await content.save()

     res.status(200).json({
      success : true,
      message : "Content Updated Successfully",
      content
     })
  }catch(e){
    console.error("Update content error",e);

    res.status(500).json({
      success : false,
      message : "Internal server Error",
    })
  }
}

export const deleteContent = async(req : Request,res : Response) => {
  try {
    const contentId = req.params.id;
    if(!isValidObjectId(contentId)){
      return res.status(400).json({
        success : false,
        message : "Not a Valid Content Id"
      })
    }
    const userId = req.user?.userId;
    if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged in."
      })
    }
    const content = await Content.findOneAndDelete({
      _id : contentId,
      userId : userId
    })
    if(!content){
      return res.status(404).json({
        success : false,
        message : "Content Not found in db"
      })
    }
    res.status(200).json({
      success : true,
      message : "Content Deleted Successfully"
    })
  }catch(e){
    console.error("Delete Content Error:",e);

    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}

export const deleteAllContent = async(req : Request,res : Response) => {
  try {
     const userId = req.user?.userId;
     if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged in."
      })
     }
     const delContent = await Content.deleteMany({
      userId : userId
     });
     if(delContent.deletedCount === 0){
      return res.status(404).json({
        success : false,
        message : "Not Any Content"
      })
     }
     res.status(200).json({
      success : true,
      message : "All content deleted successfully..",
      delContent
     })
  }catch(e){
      console.error("Delete all content Error",e);
      res.status(500).json({
        success : false,
        message : "Internal Server Error"
      })
  }
}