import { NextFunction, Response } from 'express';

import { JwtService } from '../../../infrastructure/services/JwtService';
import { UnauthorizedError } from '../../../shared/errors/HttpError';
import { AuthenticatedRequest } from '../../../shared/types';

export const createAuthMiddleware = (jwtService: JwtService) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    try {
      const authorization = request.headers.authorization;
      if (!authorization?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing bearer token');
      }

      const token = authorization.replace('Bearer ', '').trim();
      const payload = jwtService.verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        tokenVersion: payload.tokenVersion,
      };
      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  };
};
