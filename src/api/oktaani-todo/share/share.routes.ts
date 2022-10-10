import express from 'express';

import {
  createNewShare,
  getShareById,
  deleteShareById,
} from './share.handlers';

const router = express.Router();

//api/v2/oktaani-todo/share/
router.get('/:id', getShareById);
router.post('/', createNewShare);
router.delete('/:id', deleteShareById);

export default router;
