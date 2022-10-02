import express from 'express';

import qwiaPhotosRoutes from './qwia-photos';

const router = express.Router();

//api/v2/
router.use('/qwia-photos', qwiaPhotosRoutes);

export default router;
