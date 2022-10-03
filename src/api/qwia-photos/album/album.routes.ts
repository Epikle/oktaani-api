import express from 'express';

import { checkJwt } from '../../../middlewares';
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
router.get('/:aid', getAlbumPhotosById);
router.get('/all', checkJwt, getAllAlbums);
router.post('/', checkJwt, createAlbum);
router.patch('/:aid', checkJwt, updateAlbumById);
router.delete('/:aid', checkJwt, deleteAlbumById);

export default router;
