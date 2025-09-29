import userRepository from '../repositories/user.repository.js';
import ValidationError from '../utils/errors/validation.error.js';

export const signUpService = async (data) => {
  try {
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
  }
};
