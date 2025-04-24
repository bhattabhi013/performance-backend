import { Router } from 'express';
import { getReport } from '../controllers/report.controller';

const router = Router();

router.get('/report/:reportId', getReport);

export default router;