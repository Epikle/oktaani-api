import express from 'express';

import shareRoutes from './share/share.routes';
import logRoutes from './log/log.routes';

const router = express.Router();

//api/v2/oktaani-todo-v2/
router.use('/share', shareRoutes);
router.use('/log', logRoutes);

export default router;
