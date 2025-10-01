import { Queue } from 'bullmq';

import redisConfig from '../config/redis.config.js';

export default new Queue('mailQueue', {
  redis: redisConfig
});
