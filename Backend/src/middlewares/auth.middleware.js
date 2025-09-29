import {customErrorResponse, internalErrorResponse} from "../utils/common/response.object.js";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/server.config.js";
import {StatusCodes} from "http-status-codes";
import userRepository from "../repositories/user.repository.js";

export const isAuthenticated = async (req, res, next) => {
   try {
       const token = req.headers['x-access-token'];
       if(!token) {
           return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
               explanation: 'Invalid data sent from the client',
               message: 'No auth token provided',
           }))
       }

       const response = jwt.verify(token, JWT_SECRET);

       if(!response) {
           return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
               explanation: 'Invalid data sent from the client',
               message: 'Invalid auth token',
           }))
       }

       const user = await userRepository.getById(response.id);
       if(!user) {
           return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
               explanation: 'Invalid data sent from the client',
               message: 'Invalid auth token',
           }))
       }
       req.user = user.id;
       next();
   } catch (error) {
       console.log('Auth middleware error:', error);
       if(error.name === 'JsonWebTokenError'){
           return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
               explanation: 'Invalid data sent from the client',
               message: 'Invalid auth token provided',
           }))
       }
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
   }
};