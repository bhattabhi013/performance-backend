import { Request, Response, NextFunction } from "express";
import { AnalyzerService } from "../../services/analyzer.service";
import logger from "../../utils/logger";

// Explicitly type the function to match Express's expected handler signature
export const analyzeUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Return type changed to void
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

    // Perform analysis synchronously
    const analyzerService = new AnalyzerService();

    try {
      // Analyze the website and get results directly
      const analysisResult = await analyzerService.analyzeWebsite(url);

      // Return the complete analysis results
      res.status(200).json(analysisResult);
      return;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      logger.error(`Error analyzing ${url}: ${errorMessage}`);
      res.status(500).json({
        error: "Analysis failed",
        message: "Something went wrong! Try again with different url", // errorMessage,
        url,
      });
      return;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error(`Error in analyze controller: ${errorMessage}`);
    next(error);
  }
};
