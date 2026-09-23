import express from "express";

const router = express.Router();

import { createContent, deleteAllContent, deleteContent, getContent, getContentById, updateContent } from "../controllers/content.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

router.post("/content",authMiddleware,createContent);
router.get("/content",authMiddleware,getContent);
router.get("/content/:id",authMiddleware,getContentById);
router.put("/content/:id",authMiddleware,updateContent);
router.delete("/content/:id",authMiddleware,deleteContent);
router.delete("/contents/deleteAll",authMiddleware,deleteAllContent);

export default router;