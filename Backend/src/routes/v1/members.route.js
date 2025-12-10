import express from 'express';

import { isMemberPartOfWorkspaceController } from '../../controllers/member.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get(
  '/workspace/:workspaceId',
  isAuthenticated,
  isMemberPartOfWorkspaceController
);

export default router;
