import express from 'express';

import channelRouter from './channel.route.js';
import usersRouter from './users.route.js';
import workspaceRouter from './workspace.route.js';

const router = express.Router();

router.use('/users', usersRouter);

router.use('/workspaces', workspaceRouter);

router.use('/channels', channelRouter);

export default router;
