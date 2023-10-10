import express from 'express';

import shareRoutes from './share/share.routes';
import logRoutes from './log/log.routes';
import statsRoutes from './stats/stats.routes';

const router = express.Router();

//api/v2/todo/
router.use('/share', shareRoutes);
router.use('/log', logRoutes);
router.use('/stats', statsRoutes);

export default router;
