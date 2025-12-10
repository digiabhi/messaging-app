import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channel.repository.js';
import messageRepository from '../repositories/message.repository.js';
import ClientError from '../utils/errors/client.error.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';

export const getMessagesService = async (messageParams, page, limit, user) => {
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );
  const workspace = channelDetails.workspaceId;
  const isMember = isUserMemberOfWorkspace(workspace, user);
  if (!isMember) {
    throw new ClientError({
      explanation: 'User is not a member of the workspace',
      message: 'You are not authorized to view this channel',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }
  const messages = await messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
  );
  return messages;
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);
  return newMessage;
};
