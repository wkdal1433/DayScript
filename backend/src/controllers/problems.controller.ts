import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Get all problems with filters
export const getProblems = async (req: Request, res: Response): Promise<any> => {
    try {
        const { level, difficulty, language, type, limit = '20' } = req.query;

        const where: any = {
            isPublished: true,
        };

        if (level) where.level = Number(level);
        if (difficulty) where.difficulty = difficulty;
        if (language) where.language = language;
        if (type) where.type = type;

        const problems = await prisma.quizProblem.findMany({
            where,
            take: Number(limit),
            select: {
                id: true,
                level: true,
                type: true,
                difficulty: true,
                language: true,
                title: true,
                description: true,
                tags: true,
                category: true,
                estimatedTimeMinutes: true,
                attemptCount: true,
                successCount: true,
                averageAccuracy: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            problems,
            count: problems.length,
        });
    } catch (error) {
        console.error('Get problems error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific problem by ID
export const getProblemById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const problem = await prisma.quizProblem.findUnique({
            where: { id },
            select: {
                id: true,
                level: true,
                type: true,
                difficulty: true,
                language: true,
                title: true,
                description: true,
                question: true,
                options: true,
                codeSnippet: true,
                hint1: true,
                hint2: true,
                hint3: true,
                tags: true,
                category: true,
                estimatedTimeMinutes: true,
                // Do NOT include correctAnswer - that's for validation only
            },
        });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.status(200).json({ problem });
    } catch (error) {
        console.error('Get problem by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get random problems for a session
export const getRandomProblems = async (req: Request, res: Response): Promise<any> => {
    try {
        const { level, count = '5', language } = req.query;

        if (!level) {
            return res.status(400).json({ error: 'Level is required' });
        }

        const where: any = {
            level: Number(level),
            isPublished: true,
        };

        if (language) {
            where.language = language;
        }

        // Get all problems matching criteria
        const allProblems = await prisma.quizProblem.findMany({
            where,
            select: {
                id: true,
                level: true,
                type: true,
                difficulty: true,
                language: true,
                title: true,
                description: true,
                question: true,
                options: true,
                codeSnippet: true,
                hint1: true,
                hint2: true,
                hint3: true,
                tags: true,
                category: true,
                estimatedTimeMinutes: true,
            },
        });

        // Shuffle and select random problems
        const shuffled = allProblems.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Number(count));

        res.status(200).json({
            problems: selected,
            count: selected.length,
        });
    } catch (error) {
        console.error('Get random problems error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit an answer and get immediate feedback
export const submitAnswer = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { problemId, userAnswer, timeTakenSeconds, hintsUsedCount = 0 } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!problemId || userAnswer === undefined || !timeTakenSeconds) {
            return res.status(400).json({ error: 'Problem ID, answer, and time are required' });
        }

        // Get the problem with correct answer
        const problem = await prisma.quizProblem.findUnique({
            where: { id: problemId },
        });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Check answer correctness
        let isCorrect = false;
        let score = 0;

        const correctAnswer: any = problem.correctAnswer;

        // Simple answer validation (can be enhanced for different problem types)
        if (problem.type === 'OX') {
            isCorrect = userAnswer === correctAnswer.answer;
        } else if (problem.type === 'MULTIPLE_CHOICE') {
            isCorrect = userAnswer === correctAnswer.answer;
        } else if (problem.type === 'FILL_IN_BLANK') {
            const userAnswerLower = String(userAnswer).toLowerCase().trim();
            const correctAnswerLower = String(correctAnswer.answer).toLowerCase().trim();
            isCorrect = userAnswerLower === correctAnswerLower;

            // Check alternative answers
            if (!isCorrect && correctAnswer.alternatives) {
                isCorrect = correctAnswer.alternatives.some(
                    (alt: string) => alt.toLowerCase().trim() === userAnswerLower
                );
            }
        }

        // Calculate score (can be enhanced with hint penalties etc.)
        if (isCorrect) {
            score = 100 - (hintsUsedCount * 10); // Deduct 10 points per hint
            score = Math.max(score, 0);
        }

        // Save attempt
        const attempt = await prisma.problemAttempt.create({
            data: {
                userId,
                problemId,
                userAnswer: { answer: userAnswer },
                isCorrect,
                score,
                timeTakenSeconds,
                hintsUsedCount,
            },
        });

        // Update problem statistics
        await prisma.quizProblem.update({
            where: { id: problemId },
            data: {
                attemptCount: { increment: 1 },
                successCount: isCorrect ? { increment: 1 } : undefined,
            },
        });

        // Return feedback
        res.status(200).json({
            attemptId: attempt.id,
            isCorrect,
            score,
            correctAnswer: isCorrect ? null : correctAnswer,
            explanation: correctAnswer.explanation || null,
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
