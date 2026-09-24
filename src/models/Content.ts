import { Schema, model ,Types} from "mongoose";
const contentTypes = ['image', 'video', 'article', 'audio'];
const ContentSchema = new Schema(
  { 
     userId : {
      type :  Types.ObjectId,
      ref : "User",
      required : true,
    },
     title : {
      type : String,
      required : true,
    },
    description : {
      type : String,
      trim : true,
    },
    type : {
      type : String,
      enum : contentTypes,
      required : true,
    },
    link : {
      type : String,
      trim : true,
    },
    tags : {
    type : [String],
    default : [],
    },
  },
  {
    timestamps : true,
  }
)

export const Content = model("Content",ContentSchema);