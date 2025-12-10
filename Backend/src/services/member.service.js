import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/user.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import ClientError from '../utils/errors/client.error.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace)
    throw new ClientError({
      explanation: 'Invalid data sent from the client',
      message: 'Workspace Not Found',
      statusCode: StatusCodes.NOT_FOUND
    });
  const isUserAMember = isUserMemberOfWorkspace(workspace, memberId);
  if (!isUserAMember) {
    throw new ClientError({
      explanation: 'User is not a member of the workspace',
      message: 'You are not authorized to view this channel',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }
  const user = await userRepository.getById(memberId);
  return user;
};
