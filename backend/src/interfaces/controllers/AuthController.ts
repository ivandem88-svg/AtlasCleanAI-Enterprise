import { NextFunction, Request, Response } from 'express';

import { loginSchema, refreshTokenSchema, registerSchema } from '../../application/dtos/AuthDto';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/RefreshTokenUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { validateSchema } from '../../shared/utils/validator';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(registerSchema, request.body);
      const result = await this.registerUseCase.execute(payload);
      response.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(loginSchema, request.body);
      const result = await this.loginUseCase.execute(payload);
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = validateSchema(refreshTokenSchema, request.body);
      const result = await this.refreshTokenUseCase.execute(payload.refreshToken);
      response.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
