import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../config/server.config.js';

export const createJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
