import express from 'express';
import {
    addChannelToWorkspaceController,
    addMemberToWorkspaceController,
    createWorkspaceController, deleteWorkspaceController, getWorkspaceByJoinCodeController, getWorkspaceController,
    getWorkspacesUserIsMemberOfController, updateWorkspaceController
} from "../../controllers/workspace.controller.js";
import {
    addChannelToWorkspaceSchema,
    addMemberToWorkspaceSchema,
    createWorkspaceSchema
} from "../../validators/workspace.validator.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";
import {validate} from "../../validators/zod.validator.js";

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkspaceSchema), createWorkspaceController);
router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController)
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/join/:joinCode', isAuthenticated, getWorkspaceByJoinCodeController);
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
router.put('/:workspaceId/members', isAuthenticated, validate(addMemberToWorkspaceSchema), addMemberToWorkspaceController);
router.put('/:workspaceId/channels', isAuthenticated, validate(addChannelToWorkspaceSchema),addChannelToWorkspaceController);

export default router;
