import express from 'express';

import {
  getSharedCollection,
  createSharedCollection,
  updateSharedCollection,
  deleteSharedCollection,
} from './share.handlers';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/:id', getSharedCollection);
router.post('/', createSharedCollection);
router.put('/:id', updateSharedCollection);
router.delete('/:id', deleteSharedCollection);

export default router;
