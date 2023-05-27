import express from 'express';

import {
  getSharedCollection,
  createSharedCollection,
  updateSharedCollection,
  deleteSharedCollection,
} from './share.handlers';
import { logger } from '../middlewares';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/:id', getSharedCollection);
router.post('/', createSharedCollection);
router.put('/:id', logger('UPDATE'), updateSharedCollection);
router.delete('/:id', deleteSharedCollection);

export default router;
