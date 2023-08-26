import express from 'express';

import {
  getSharedCollection,
  createSharedCollection,
  createSharedItem,
  updateSharedCollection,
  deleteSharedCollection,
  deleteSharedItems,
} from './share.handlers';
import { logger } from '../middlewares';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/:id', getSharedCollection);
router.post('/', createSharedCollection);
router.post('/items/:id', logger('NEW ITEM'), createSharedItem);
router.put('/:id', logger('UPDATE'), updateSharedCollection);
router.delete('/:id', deleteSharedCollection);
router.delete('/items/:id', logger('DELETE DONE'), deleteSharedItems);

export default router;
