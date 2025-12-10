import express from 'express';

import { getMessages } from '../../controllers/message.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/messages/:channelId', isAuthenticated, getMessages);

export default router;
