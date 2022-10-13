import express from 'express';

import { getAllDtcs } from './dtc.handlers';

const router = express.Router();

//api/v2/oktaani-dtc/dtc/
router.get('/', getAllDtcs);

export default router;
