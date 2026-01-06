import { Router } from 'express';
import {
    getUserProgress,
    getLevelStatistics,
    completeLevel,
    getAttemptHistory,
} from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUserProgress);
router.get('/level/:level', getLevelStatistics);
router.post('/complete-level', completeLevel);
router.get('/attempts', getAttemptHistory);

export default router;
