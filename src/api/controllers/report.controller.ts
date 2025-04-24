import { Request, Response, NextFunction } from 'express';
import { reports } from './analyze.controller';
import logger from '../../utils/logger';

export const getReport = async (req: Request, res: Response, NextFunction: NextFunction) => {
  try {
    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ error: 'Report ID is required' });
    }

    const report = reports[reportId];

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    logger.error(`Error in report controller: ${error}`);
    NextFunction(error);
  }
};