import { Router } from 'express';
import {
    getProblems,
    getProblemById,
    getRandomProblems,
    submitAnswer
} from '../controllers/problems.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes (can view problems without auth for preview)
router.get('/', getProblems);
router.get('/random', getRandomProblems);
router.get('/:id', getProblemById);

// Protected routes (requires authentication)
router.post('/submit', authenticate, submitAnswer);

export default router;
