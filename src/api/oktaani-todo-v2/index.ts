import express from 'express';

import shareRoutes from './share/share.routes';

const router = express.Router();

//api/v2/oktaani-todo-v2/
router.use('/share', shareRoutes);

export default router;
