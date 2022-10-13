import express from 'express';

import dtcRoutes from './dtc/dtc.routes';

const router = express.Router();

//api/v2/oktaani-dtc/
router.use('/dtc', dtcRoutes);

export default router;
