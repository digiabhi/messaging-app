import mailer from '../config/mail.config.js';
import mailQueue from '../queues/mail.queue.js';
mailQueue.process(async (job, done) => {
  const emailData = job.data;
  console.log('Processing email job:', emailData);
  try {
    const response = await mailer.sendMail(emailData);
    console.log('Email sent successfully:', response);
    done();
  } catch (error) {
    console.log('Error processing email job:', error);
  }
});
