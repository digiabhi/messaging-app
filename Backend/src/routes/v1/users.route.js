import express from 'express';

import { signIn, signUp } from '../../controllers/user.controller.js';
import {
  userSignInSchema,
  userSignUpSchema
} from '../../validators/user.validator.js';
import { validate } from '../../validators/zod.validator.js';

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signUp);
router.post('/signin', validate(userSignInSchema), signIn);

export default router;
