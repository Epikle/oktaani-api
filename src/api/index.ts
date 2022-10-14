import express from 'express';

import qwiaPhotosRoutes from './qwia-photos';
import oktaaniTodoRoutes from './oktaani-todo';
import oktaaniDtcRoutes from './oktaani-dtc';

const router = express.Router();

//api/v2/
router.use('/qwia-photos', qwiaPhotosRoutes);
router.use('/oktaani-todo', oktaaniTodoRoutes);
router.use('/oktaani-dtc', oktaaniDtcRoutes);

export default router;
