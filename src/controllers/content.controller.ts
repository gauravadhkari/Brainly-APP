import type { NextFunction, Request, Response } from "express";
import { Content } from "../models/Content.js";
import { isValidObjectId , Types } from "mongoose";
import { generateRandomString } from "../utils.js";
import User from "../models/User.js";
import { z } from "zod";
import { contentSchema, updateContentSchema } from "../validations/content.validation.js";

export const createContent = async (req : Request, res : Response, next : NextFunction) => {
   try{
       const result = contentSchema.safeParse(req.body);
       if(!result.success){
        return res.status(400).json({
          success : false,
          message : "Validation Failed!",
          errors: z.flattenError(result.error).fieldErrors
        })
       }
       const {link , title, type , tags , description} = result.data;
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
       const normalizedTags = tags?.map(tag => 
        tag.toLowerCase().trim()
       );
       await Content.create({
        link,
        type,
        title,
        tags : normalizedTags,
         ...(description !== undefined ? { description } : {}),
        userId : new Types.ObjectId(userId),
       });
       res.status(201).json({
        success : true,
        message : "Content created Successfully.."
       });
   }catch(e){
      console.error("Content Adding Error:",e);

      next(e);
   }
}

export const getContent = async (req : Request ,res : Response,next : NextFunction) => {
  try{
     const userId = req.user?.userId;
     if(!userId){
      return res.status(401).json({
        success : false,
        message : "You're not logged In.."
      })
     }

     const type = typeof req.query.type === "string" ? req.query.type.toLowerCase() : undefined;
     const tag = typeof req.query.tag === "string" ? req.query.tag.toLowerCase().trim() : undefined;
     const search = typeof req.query.search === "string" ? req.query.search.trim() : undefined;
     const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";

     const page = Math.max(1, Number.parseInt(req.query.page as string) || 1);
     const limit = Math.min(50, Math.max(1,Number.parseInt(req.query.limit as string) || 10));

     const filter : Record<string,any> = {
      userId,
     }
     if(type){
      filter.type = type
     }
     if(tag){
      filter.tags = tag
     }
     if(search){
      filter.$or = [
        {
          title : {
            $regex : search,
            $options : "i",
          }
        },
        {
          description : {
            $regex : search,
            $options : "i",
          }
        },
        {
          tags : {
            $regex : search,
            $options : "i",
          },
        },
      ];
     }
     const sortOption = sort === "oldest" ? { createdAt : 1 as const} : { createdAt : -1 as const};
     const skip = (page - 1) * limit;
     const totalItems = await Content.countDocuments(filter);
     const content = await Content.find(filter)
     .sort(sortOption)
     .skip(skip)
     .limit(limit);
     const totalPages = Math.ceil(totalItems / limit);
     res.status(200).json({
      success : true,
      message : "Content Returned Successfully",
      pagination : {
        currentPage : page,
        limit,
        totalItems,
        totalPages,
      },
      content
     })
  }catch(e){
     console.error("Get Content Error:",e);
     next(e);
  }
}

export const getContentById = async(req : Request,res : Response, next : NextFunction) => {
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
     });
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
      next(e);
  }
}

export const updateContent = async(req : Request,res : Response,next : NextFunction) => {
  try{
    const result = updateContentSchema.safeParse(req.body);
    if(!result.success){
      return res.status(400).json({
        success : false,
        message : "Validation Failed!",
        errors: z.flattenError(result.error).fieldErrors
      })
    }
     const {link , title, type, tags,description} = result.data;
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
     if (link !== undefined) content.link = link;
     if (title !== undefined) content.title = title;
     if (type !== undefined) content.type = type;
     if (description !== undefined) content.description = description;
     if (tags !== undefined) content.tags = tags;

     await content.save()

     res.status(200).json({
      success : true,
      message : "Content Updated Successfully",
      content
     })
  }catch(e){
    console.error("Update content error",e);

    next(e);
  }
}

export const deleteContent = async(req : Request,res : Response,next : NextFunction) => {
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

   next(e);
  }
}

export const deleteAllContent = async(req : Request,res : Response, next : NextFunction) => {
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
      next(e);
  }
}

export const shareLink = async(req : Request,res : Response, next : NextFunction) => {
  try{
       const userId = req.user?.userId;
       if(!userId){
        return res.status(401).json({
          success : false,
          message : "Unauthorized Access.."
        })
       }
       const user = await User.findOne({_id : userId});
          if(!user){
            return res.status(404).json({
              success : false,
              message : "User not found"
            })
          }
       const shareEnabled = req.body.sharingEnabled;
       if(shareEnabled === true){
        const shareLink  = generateRandomString(10);
        user.sharingEnabled = true;
        user.shareId = shareLink;
        await user.save(); 
        return res.status(200).json({
          success : true,
          message : "Share link created Successfully",
          Link : "http://localhost:8080/api/v1/contents/share/" + user.shareId,
        });
       }else{
        user.sharingEnabled = false;
        user.shareId = null;
        await user.save();
        return res.status(200).json({
          success : true,
          message : "Sharing Disabled Successfully"
        })
       }
       
  }catch(e){
      
    next(e);
  }
}

export const sharedContent = async(req : Request,res : Response,next : NextFunction) => {
  try{
     const shareId = req.params.sharedId;
     if(!shareId){
      return res.status(400).json({
        message : "Not a share id"
      })
     }
     const user = await User.findOne({
      shareId,
      sharingEnabled : true,
    });
     if(!user){
      return res.status(404).json({
        message : "Not a valid id"
      })
     }
     const content = await Content.find({userId : user._id});
     if(content.length === 0){
      return res.status(200).json({
        success : true,
        message : "No Content..",
        content
      })
     }
     res.status(200).json({
      success : true,
      message : "Shared Content Returned",
      content
     })
  }catch(e){
      next(e);
  }
}