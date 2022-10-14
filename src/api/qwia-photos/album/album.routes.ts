import express from 'express';

import { checkJwtQwia } from '../../../middlewares';
import {
  getVisibleAlbums,
  getAllAlbums,
  getAlbumPhotosById,
  createAlbum,
  updateAlbumById,
  deleteAlbumById,
} from './album.handlers';

const router = express.Router();

//api/v2/qwia-photos/album/
router.get('/', getVisibleAlbums);
router.get('/all', checkJwtQwia, getAllAlbums);
router.get('/:aid', getAlbumPhotosById);
router.post('/', checkJwtQwia, createAlbum);
router.patch('/:aid', checkJwtQwia, updateAlbumById);
router.delete('/:aid', checkJwtQwia, deleteAlbumById);

export default router;
