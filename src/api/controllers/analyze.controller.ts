import { Request, Response, NextFunction } from 'express';
import { AnalyzerService } from '../../services/analyzer.service';
import logger from '../../utils/logger';
import { error } from 'console';

export const analyzeUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Perform analysis synchronously
    const analyzerService = new AnalyzerService();
    
    try {
      // Analyze the website and get results directly
      const analysisResult = await analyzerService.analyzeWebsite(url);
      
      // Return the complete analysis results
      return res.status(200).json(analysisResult);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Error analyzing ${url}: ${errorMessage}`);
      return res.status(500).json({ 
        error: 'Analysis failed', 
        message: errorMessage,
        url
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error(`Error in analyze controller: ${errorMessage}`);
    next(error);
  }
};
