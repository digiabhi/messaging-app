import express from 'express';

import { getChannelByIdController } from '../../controllers/channel.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getChannelByIdController);

export default router;
