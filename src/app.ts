import express from "express";
// cors does not currently provide TypeScript declarations in this project.
// @ts-expect-error Missing declaration file for module "cors".
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import contentRoutes from "./routes/content.routes.js"
import { globalLimiter } from "./middleware/rateLimit.middleware.js";
import  helmet  from "helmet";
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin : "http://localhost:5173",
  methods : ["GET","POST","DELETE","UPDATE"],
  allowedHeaders  : ["Content-Type", "Authorization"]
}));
app.use(globalLimiter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1",contentRoutes);
app.get("/health" , (req,res) => {
  res.status(200).json({
    message : "API is working Fine..."
  })
})
app.use(errorMiddleware);
export default app;