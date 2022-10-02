import express from 'express';

import { checkJwt } from '../../../middlewares';
import { getS3SignedUrl } from './media.handlers';

const router = express.Router();

//api/v2/qwia-photos/media?filetype=
router.get('/', checkJwt, getS3SignedUrl);

export default router;
