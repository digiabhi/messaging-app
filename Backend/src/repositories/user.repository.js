import User from "../schema/user.schema.js";
import crudRepository from "./crud.repository.js";

const userRepository = {
    ...crudRepository(User),
    getByEmail: async function(email){
        const user = await User.findOne({ email });
        return user;
    },
    getByUsername: async function(username){
        const user = await User.findOne({ username });
        return user;
    }
};

export default userRepository;