import express from 'express';

import { checkJwt } from '../../../middlewares';
import {
  createPhoto,
  updatePhotoById,
  deletePhotoById,
} from './photo.handlers';

const router = express.Router();

//api/v2/qwia-photos/photo/
router.post('/:aid', checkJwt, createPhoto);
router.patch('/:pid', checkJwt, updatePhotoById);
router.delete('/:pid', checkJwt, deletePhotoById);

export default router;
