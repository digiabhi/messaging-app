import express from 'express';

import {signUp} from "../../controllers/user.controller.js";
import {validate} from "../../validators/zod.validator.js";
import {userSignUpSchema} from "../../validators/user.validator.js";

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signUp)


export default router;