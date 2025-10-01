import { Worker } from 'bullmq';

import mailer from '../config/mail.config.js';
import redisConfig from '../config/redis.config.js';

new Worker(
  'mailQueue',
  async (job) => {
    const emailData = job.data;
    console.log('Processing email job:', emailData);
    try {
      const response = await mailer.sendMail(emailData);
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.log('Error processing email job:', error);
    }
  },
  {
    connection: redisConfig
  }
);
