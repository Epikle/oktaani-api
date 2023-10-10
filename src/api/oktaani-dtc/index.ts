import express from 'express';

import gptRoutes from './gpt/gpt.routes';

const router = express.Router();

//api/v2/oktaani-dtc/
router.use('/gpt', gptRoutes);

export default router;
