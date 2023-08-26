import express from 'express';

import {
  getSharedCollection,
  createSharedCollection,
  createSharedItem,
  updateSharedCollection,
  updateSharedItem,
  deleteSharedCollection,
  deleteSharedItems,
  deleteSharedItem,
} from './share.handlers';
import { logger } from '../middlewares';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/:cid', getSharedCollection);
router.post('/', createSharedCollection);
router.post('/:cid/items', logger('NEW ITEM'), createSharedItem);
router.put('/:cid', logger('UPDATE COLLECTION'), updateSharedCollection);
router.put('/:cid/items/:id', logger('UPDATE ITEM'), updateSharedItem);
router.delete('/:cid', deleteSharedCollection);
router.delete('/:cid/items', logger('DELETE DONE'), deleteSharedItems);
router.delete('/:cid/items/:id', logger('DELETE ITEM'), deleteSharedItem);

export default router;
