import express from "express";
// cors does not currently provide TypeScript declarations in this project.
// @ts-expect-error Missing declaration file for module "cors".
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import contentRoutes from "./routes/content.routes.js"
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1",contentRoutes);
app.get("/health" , (req,res) => {
  message : "API is working Fine..."
})
export default app;