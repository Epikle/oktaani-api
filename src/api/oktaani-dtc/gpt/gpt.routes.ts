import express from 'express';

import { getCompletion } from './gpt.handlers';

const router = express.Router();

//api/v2/oktaani-dtc/dtc/
router.get('/', getCompletion);

export default router;
