import User from '../schema/user.schema.js';
import crudRepository from './crud.repository.js';

const userRepository = {
  ...crudRepository(User),
  signUpUser: async function (data) {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  },
  getByEmail: async function (email) {
    const user = await User.findOne({ email });
    return user;
  },
  getByUsername: async function (username) {
    const user = await User.findOne({ username }).select('-password'); // exclude password from response
    return user;
  }
};

export default userRepository;
