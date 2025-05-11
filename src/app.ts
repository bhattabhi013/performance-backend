import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import analyzeRoutes from "./api/routes/analyze.routes";
import { errorHandler } from "./api/middlewares/error.middleware";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", analyzeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Web Performance Analyzer API is running",
  });
});

// Error handling
app.use(errorHandler as ErrorRequestHandler);

export default app;
