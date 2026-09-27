import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js"


const PORT = Number(process.env.PORT) || 8080;

const startServer = async ()=>{
  await mongoose.connect(`${process.env.MONGO_URI}`);
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
  })
}
startServer();