import express from 'express';

import qwiaPhotosRoutes from './qwia-photos';
import oktaaniTodoRoutes from './oktaani-todo';
import oktaaniDtcRoutes from './oktaani-dtc';
import oktaaniTodoV2Routes from './oktaani-todo-v2';

const router = express.Router();

//api/v2/
router.use('/qwia-photos', qwiaPhotosRoutes);
router.use('/oktaani-todo', oktaaniTodoRoutes);
router.use('/oktaani-dtc', oktaaniDtcRoutes);
router.use('/oktaani-todo-v2', oktaaniTodoV2Routes);

export default router;
