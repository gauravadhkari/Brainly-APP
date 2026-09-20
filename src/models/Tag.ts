import {Schema , model, Types} from "mongoose";

const TagSchema = new Schema(
  {
    title : {
      type : String,
      required : true,
      unique : true,
    }
  }
)

export const Tag = model("Tag",TagSchema);