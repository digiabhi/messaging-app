import { StatusCodes } from 'http-status-codes';

import { signUpService } from '../services/user.service.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/response.object.js';

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, 'User created successfully'));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
