import express from 'express';

import { checkJwt } from '../../../middlewares';
import {
  createPhoto,
  updatePhotoById,
  deletePhotoById,
  addLikeToPhotoById,
  deleteLikeFromPhotoById,
} from './photo.handlers';

const router = express.Router();

//api/v2/qwia-photos/photo/
router.post('/:aid', checkJwt, createPhoto);
router.patch('/:pid', checkJwt, updatePhotoById);
router.delete('/:pid', checkJwt, deletePhotoById);

//api/v2/qwia-photos/photo/like/
router.post('/like/:pid', addLikeToPhotoById);
router.delete('/like/:pid', deleteLikeFromPhotoById);

export default router;
