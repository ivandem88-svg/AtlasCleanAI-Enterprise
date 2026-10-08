import { LoginInput } from '../../dtos/AuthDto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../../shared/errors/HttpError';
import { compareHash } from '../../../shared/utils/crypto';
import { JwtService } from '../../../infrastructure/services/JwtService';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await compareHash(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive()) {
      throw new UnauthorizedError('User account is not active');
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
