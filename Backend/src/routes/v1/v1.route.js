import express from 'express';

import usersRouter from './users.route.js';
import workspaceRouter from './workspace.route.js';

const router = express.Router();

router.use('/users', usersRouter);

router.use('/workspaces', workspaceRouter);

export default router;
