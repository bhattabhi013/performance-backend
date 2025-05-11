import { Router, Request, Response, NextFunction } from "express";
import { analyzeUrl } from "../controllers/analyze.controller";

const router = Router();

router.post("/analyze", analyzeUrl);

export default router;
