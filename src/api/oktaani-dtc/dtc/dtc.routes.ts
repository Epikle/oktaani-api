import express from 'express';

import { checkJwtOktaani } from '../../../middlewares';
import {
  getAllDtcs,
  createDtc,
  updateDtcById,
  deleteDtcById,
} from './dtc.handlers';

const router = express.Router();

//api/v2/oktaani-dtc/dtc/
router.get('/', getAllDtcs);
router.post('/', checkJwtOktaani, createDtc);
router.patch('/:id', checkJwtOktaani, updateDtcById);
router.delete('/:id', checkJwtOktaani, deleteDtcById);

export default router;
