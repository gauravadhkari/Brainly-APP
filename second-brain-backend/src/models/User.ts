import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username :{
      type : String,
      unique : true,
      required : true,
      minimum : 15,
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
      sparse : true,
    }
  },
  {
    timestamps : true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;