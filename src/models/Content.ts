import { Schema, model ,Types} from "mongoose";

const ContentSchema = new Schema(
  {
    link : {
      type : String,
    },
    title : {
      type : String,
      required : true,
    },
    type : {
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