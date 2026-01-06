import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// Get user progress
export const getUserProgress = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const progress = await prisma.userProgress.findUnique({
            where: { userId },
        });

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        // Get level statistics
        const levelStats = await prisma.userLevelStatistics.findMany({
            where: { userId },
            orderBy: { level: 'asc' },
        });

        res.status(200).json({
            progress,
            levelStats,
        });
    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user level statistics for a specific level
export const getLevelStatistics = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { level } = req.params;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const stats = await prisma.userLevelStatistics.findUnique({
            where: {
                userId_level: {
                    userId,
                    level: Number(level),
                },
            },
        });

        if (!stats) {
            return res.status(404).json({ error: 'Statistics not found for this level' });
        }

        res.status(200).json({ stats });
    } catch (error) {
        console.error('Get level statistics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Complete a level
export const completeLevel = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { level } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!level) {
            return res.status(400).json({ error: 'Level is required' });
        }

        // Get current progress
        const progress = await prisma.userProgress.findUnique({
            where: { userId },
        });

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        // Check if level is already completed
        if (progress.completedLevels.includes(level)) {
            return res.status(400).json({ error: 'Level already completed' });
        }

        // Update progress
        const updatedProgress = await prisma.userProgress.update({
            where: { userId },
            data: {
                completedLevels: {
                    push: level,
                },
                unlockedLevels: {
                    push: level + 1,
                },
                currentLevel: level + 1,
            },
        });

        // Update user's current level
        await prisma.user.update({
            where: { id: userId },
            data: {
                currentLevel: level + 1,
            },
        });

        res.status(200).json({
            message: `Level ${level} completed!`,
            progress: updatedProgress,
        });
    } catch (error) {
        console.error('Complete level error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get attempt history
export const getAttemptHistory = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.userId;
        const { limit = '20', offset = '0' } = req.query;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const attempts = await prisma.problemAttempt.findMany({
            where: { userId },
            take: Number(limit),
            skip: Number(offset),
            orderBy: { attemptedAt: 'desc' },
            include: {
                problem: {
                    select: {
                        id: true,
                        level: true,
                        type: true,
                        title: true,
                        difficulty: true,
                    },
                },
            },
        });

        const total = await prisma.problemAttempt.count({
            where: { userId },
        });

        res.status(200).json({
            attempts,
            total,
            limit: Number(limit),
            offset: Number(offset),
        });
    } catch (error) {
        console.error('Get attempt history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
