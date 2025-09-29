import crudRepository from './crud.repository.js';
import Channel from "../schema/channel.schema.js";

const channelRepository = {
    ...crudRepository(Channel)
};

export default channelRepository;
