import jwt, { SignOptions } from 'jsonwebtoken';

import { config } from '../../config';
import { JwtPayload, UserRole } from '../../shared/types';

interface TokenPayloadInput {
  id: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
}

export class JwtService {
  generateAuthTokens(payload: TokenPayloadInput) {
    const tokenPayload: JwtPayload = {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
      tokenVersion: payload.tokenVersion,
    };

    return {
      accessToken: jwt.sign(tokenPayload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
      }),
      refreshToken: jwt.sign(tokenPayload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
      }),
      expiresIn: config.jwt.expiresIn,
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  }
}
