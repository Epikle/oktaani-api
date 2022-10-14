import express from 'express';

import { checkJwtQwia } from '../../../middlewares';
import {
  createPhoto,
  updatePhotoById,
  deletePhotoById,
  addLikeToPhotoById,
  deleteLikeFromPhotoById,
} from './photo.handlers';

const router = express.Router();

//api/v2/qwia-photos/photo/
router.post('/:aid', checkJwtQwia, createPhoto);
router.patch('/:pid', checkJwtQwia, updatePhotoById);
router.delete('/:pid', checkJwtQwia, deletePhotoById);

//api/v2/qwia-photos/photo/like/
router.post('/like/:pid', addLikeToPhotoById);
router.delete('/like/:pid', deleteLikeFromPhotoById);

export default router;
