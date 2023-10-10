import express from 'express';

import qwiaPhotosRoutes from './qwia-photos';
import oktaaniDtcRoutes from './oktaani-dtc';
import oktaaniTodoV2Routes from './todo';

const router = express.Router();

//api/v2/
router.use('/qwia-photos', qwiaPhotosRoutes);
router.use('/oktaani-dtc', oktaaniDtcRoutes);
router.use('/todo', oktaaniTodoV2Routes);

export default router;
