import Queue from 'bull';

import redisConfig from '../config/redis.config.js';

export default new Queue('mailQueue', {
  redis: redisConfig
});
