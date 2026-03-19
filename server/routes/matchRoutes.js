import express from 'express';
import { createMatch } from '../controllers/matchController.js';
import adminAuth from '../middleware/adminAuth.js';
import { getLeaderboard } from '../controllers/matchController.js';
import { getSeasons } from '../controllers/matchController.js';
import { getMatches } from '../controllers/matchController.js';
import { getPlayerProfile } from '../controllers/matchController.js';
import { comparePlayers } from '../controllers/matchController.js';
import { getAllMatches } from '../controllers/matchController.js';
import { deleteMatch } from '../controllers/matchController.js';
import { getSeasonCaps } from '../controllers/matchController.js';

const router = express.Router();

router.post('/seasons/:year/matches', adminAuth, createMatch);
router.get('/seasons/:year/leaderboard', getLeaderboard);
router.get('/seasons', getSeasons);
router.get('/seasons/:year/matches', getMatches);
router.get('/seasons/:year/player/:name', getPlayerProfile);
router.get('/seasons/:year/compare/:player1/:player2', comparePlayers);
router.get('/seasons/:year/all-matches', getAllMatches);
router.delete('/seasons/:year/matches/:matchId', deleteMatch);
router.get('/seasons/:year/caps', getSeasonCaps);

export default router;
