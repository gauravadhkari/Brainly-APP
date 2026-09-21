import { Schema, model ,Types} from "mongoose";
const contentTypes = ['image', 'video', 'article', 'audio'];
const ContentSchema = new Schema(
  {
    link : {
      type : String,
    },
    type : {
      type : String,
      enum : contentTypes,
      required : true,
    },
    title : {
      type : String,
      required : true,
    },
    tags : [{type : Types.ObjectId, ref : "Tag" }],
    userId : {
      type :  Types.ObjectId,
      ref : "User",
      required : true,
    },

  }
)

export const Content = model("Content",ContentSchema);