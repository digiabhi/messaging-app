import express from 'express';
import {createWorkspaceController} from "../../controllers/workspace.controller.js";
import {createWorkspaceSchema} from "../../validators/workspace.validator.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";
import {validate} from "../../validators/zod.validator.js";

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkspaceSchema), createWorkspaceController);

export default router;
