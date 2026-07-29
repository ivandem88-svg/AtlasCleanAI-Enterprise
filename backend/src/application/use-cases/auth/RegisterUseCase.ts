import { v4 as uuidv4 } from 'uuid';

import { RegisterInput } from '../../dtos/AuthDto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { ConflictError } from '../../../shared/errors/HttpError';
import { hashValue } from '../../../shared/utils/crypto';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { EmailService } from '../../../infrastructure/services/EmailService';

export interface RegisterResult {
  user: ReturnType<User['toJSON']>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    const now = new Date();
    const user = new User({
      id: uuidv4(),
      email: input.email,
      passwordHash: await hashValue(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      refreshTokenVersion: 0,
      emailVerified: false,
      preferences: {
        marketingOptIn: false,
        preferredLanguage: 'en',
        smsNotifications: true,
        emailNotifications: true,
      },
      createdAt: now,
      updatedAt: now,
    });

    const createdUser = await this.userRepository.create(user);
    const tokens = this.jwtService.generateAuthTokens({
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      tokenVersion: createdUser.refreshTokenVersion,
    });

    await this.emailService.sendWelcomeEmail(createdUser.email, createdUser.fullName);

    return {
      user: createdUser.toJSON(),
      tokens,
    };
  }
}
