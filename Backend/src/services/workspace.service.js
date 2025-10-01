import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailtoMailQueue } from '../producers/mailqueue.producer.js';
import channelRepository from '../repositories/channel.repository.js';
import userRepository from '../repositories/user.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import { workspaceJoinMail } from '../utils/common/mail.object.js';
import ClientError from '../utils/errors/client.error.js';
import ValidationError from '../utils/errors/validation.error.js';

const isUserAdminOfWorkspace = async (workspace, userId) => {
  const response = workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId?._id?.toString() === userId) &&
      member.role === 'admin'
  );
  return response;
};

export const isUserMemberOfWorkspace = async (workspace, userId) => {
  return await workspace.members.find(
    (member) => member.memberId.toString() === userId
  );
};

const isChannelAlreadyPartOfWorkspace = async (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });
    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('Create workspace service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      throw new ValidationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
    throw error;
  }
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('Get workspaces user is member of service error', error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }
    throw new ClientError({
      explanation:
        'User is either not a member of the workspace or not an admin',
      message: 'You are not authorized to delete this workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('Delete workspace service error', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is either not a member of the workspace',
        message: 'You are not authorized to view this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace service error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is either not a member of the workspace',
        message: 'You are not authorized to view this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (!isAllowed) {
      throw new ClientError({
        explanation:
          'User is either not a member of the workspace or not an admin',
        message: 'You are not authorized to update this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('Update workspace service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'You are not authorized to add members to this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isMember = await isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is already a member of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );
    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace),
      to: isValidUser.email
    });
    console.log('Email job added to queue');
    return response;
  } catch (error) {
    console.log('Add member to workspace service error', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace Not Found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation:
          'User is either not a member of the workspace or not an admin',
        message: 'You are not authorized to add channels to this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isChannelPartOfWorkspace = await isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if (isChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log('Add channel to workspace service error', error);
    throw error;
  }
};
