import { MAIL_ID } from '../../config/server.config.js';

export const workspaceJoinMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a new workspace',
    text: `You have been added to a new workspace ${workspace.name}. Please login to your account to access the workspace.`
  };
};
