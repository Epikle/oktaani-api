import express from 'express';

import {
  getAllDtcs,
  createDtc,
  updateDtcById,
  deleteDtcById,
} from './dtc.handlers';

const router = express.Router();

//api/v2/oktaani-dtc/dtc/
router.get('/', getAllDtcs);
router.post('/', createDtc);
router.patch('/:id', updateDtcById);
router.delete('/:id', deleteDtcById);

export default router;
