import {Schema , model,Types} from "mongoose";

const LinkSchema = new Schema(
  {
    hash : {
      type : String,
      required : true,
    },
    userId : {
      type : Types.ObjectId,
      ref : "User",
      required : true,
      unique : true,
    }
  }
)

export const Link = model("Link",LinkSchema);