import express from "express";

const router = express.Router();

import { signup, signin } from "../controllers/auth.controller.js";
import { me } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me",authMiddleware,me);
export default router;