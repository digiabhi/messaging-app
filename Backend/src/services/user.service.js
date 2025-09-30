import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/user.repository.js';
import { createJWT } from '../utils/common/auth.utils.js';
import ClientError from '../utils/errors/client.error.js';
import ValidationError from '../utils/errors/validation.error.js';

export const signUpService = async (data) => {
  try {
    console.log(data);
    const newUser = await userRepository.signUpUser(data);
    return newUser;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      throw new ValidationError(
        {
          error: ['A user with same email or username already exists']
        },
        'A user with same email or username already exists'
      );
    }
    throw error;
  }
};

export const signInService = async (data) => {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'No registered user found with this email',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // match the incoming password with the hashed password
    const isMatch = bcrypt.compareSync(data.password, user.password);

    if (!isMatch) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Invalid password, please try again',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
      token: createJWT({ id: user._id, email: user.email })
    };
  } catch (error) {
    console.log('User service error:', error);
    throw error;
  }
};
