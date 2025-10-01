import '../processors/mail.processor.js';

import mailQueue from '../queues/mail.queue.js';

export const addEmailtoMailQueue = async (emailData) => {
  try {
    await mailQueue.add(emailData);
    console.log('Email added to mail queue');
  } catch (error) {
    console.log('Error adding email to mail queue:', error);
  }
};
