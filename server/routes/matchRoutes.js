import express from 'express';
import { createMatch } from '../controllers/matchController.js';
import adminAuth from '../middleware/adminAuth.js';
import { getLeaderboard } from '../controllers/matchController.js';
import { getSeasons } from '../controllers/matchController.js';

const router = express.Router();

router.post('/seasons/:year/matches', adminAuth, createMatch);
router.get('/seasons/:year/leaderboard', getLeaderboard);
router.get('/seasons', getSeasons);

export default router;
