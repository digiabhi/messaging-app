import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channel.repository.js';
import ClientError from '../utils/errors/client.error.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );
    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'You are not authorized to view this channel',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log('Get channel by id service error', error);
    throw error;
  }
};
