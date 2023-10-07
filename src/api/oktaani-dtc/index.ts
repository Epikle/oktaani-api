import express from 'express';

import dtcRoutes from './dtc/dtc.routes';
import gptRoutes from './gpt/gpt.routes';

const router = express.Router();

//api/v2/oktaani-dtc/
router.use('/dtc', dtcRoutes);
router.use('/gpt', gptRoutes);

export default router;
