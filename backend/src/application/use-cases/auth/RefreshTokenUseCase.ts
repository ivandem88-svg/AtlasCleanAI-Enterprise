import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { UnauthorizedError } from '../../../shared/errors/HttpError';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError('Refresh token is invalid or expired');
    }

    return {
      user: user.toJSON(),
      tokens: this.jwtService.generateAuthTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        tokenVersion: user.refreshTokenVersion,
      }),
    };
  }
}
