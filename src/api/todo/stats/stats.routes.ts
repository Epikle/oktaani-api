import express from 'express';

import { createStats, getStats } from './stats.handlers';
import { checkStatsAuth } from '../middlewares';

const router = express.Router();

//api/v2/oktaani-todo-v2/stats/
router.get('/', checkStatsAuth, getStats);
router.post('/', createStats);

export default router;
