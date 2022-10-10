import express from 'express';

import qwiaPhotosRoutes from './qwia-photos';
import oktaaniTodoRoutes from './oktaani-todo';

const router = express.Router();

//api/v2/
router.use('/qwia-photos', qwiaPhotosRoutes);
router.use('/oktaani-todo', oktaaniTodoRoutes);

export default router;
