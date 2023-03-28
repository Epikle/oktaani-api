import express from 'express';

import {
  createSharedCollection,
  deleteSharedCollection,
  getSharedCollection,
} from './share.handlers';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/:id', getSharedCollection);
router.post('/', createSharedCollection);
router.delete('/:id', deleteSharedCollection);

export default router;
