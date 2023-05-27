import express from 'express';

import { getLogsByid } from './log.handlers';

const router = express.Router();

//api/v2/oktaani-todo-v2/log/
router.get('/:id', getLogsByid);

export default router;
