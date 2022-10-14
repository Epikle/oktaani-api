import express from 'express';

import { checkJwtQwia } from '../../../middlewares';
import { getS3SignedUrl } from './media.handlers';

const router = express.Router();

//api/v2/qwia-photos/media/:aid?filetype=image/jpeg
router.get('/:aid', checkJwtQwia, getS3SignedUrl);

export default router;
