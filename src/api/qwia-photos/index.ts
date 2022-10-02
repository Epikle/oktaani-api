import express from 'express';

import mediaRoutes from './media/media.routes';
import albumRoutes from './album/album.routes';
import photoRoutes from './photo/photo.routes';

const router = express.Router();

//api/v2/qwia-photos/
router.use('/media', mediaRoutes);
router.use('/album', albumRoutes);
router.use('/photo', photoRoutes);

export default router;
