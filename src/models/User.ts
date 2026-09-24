import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username :{
      type : String,
      unique : true,
      required : true,
    },
    email : {
      type : String,
      lowercase : true,
      trim : true,
      unique : true,
      required : true,
    },
    password : {
      type : String,
      required : true,
    },
    sharingEnabled : {
      type : Boolean,
      default : false,
    },
    shareId : {
      type : String,
      unique : true,
      default : null,
    }
  },
  {
    timestamps : true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;