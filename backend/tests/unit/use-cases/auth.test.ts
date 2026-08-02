import { RegisterUseCase } from '../../../src/application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../src/application/use-cases/auth/LoginUseCase';
import { User } from '../../../src/domain/entities/User';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { EmailService } from '../../../src/infrastructure/services/EmailService';
import { JwtService } from '../../../src/infrastructure/services/JwtService';
import { UnauthorizedError } from '../../../src/shared/errors/HttpError';
import { hashValue } from '../../../src/shared/utils/crypto';

class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find((user) => user.email === email.toLowerCase()) ?? null;
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
}

class EmailServiceStub {
  async sendWelcomeEmail(): Promise<void> {}
}

describe('Auth use cases', () => {
  const jwtService = new JwtService();

  it('registers a new customer and returns tokens', async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new RegisterUseCase(repository, jwtService, new EmailServiceStub() as unknown as EmailService);

    const result = await useCase.execute({
      email: 'customer@example.com',
      password: 'StrongPass123',
      firstName: 'Atlas',
      lastName: 'Customer',
    });

    expect(result.user.email).toBe('customer@example.com');
    expect(result.tokens.accessToken).toBeTruthy();
    expect(await repository.findByEmail('customer@example.com')).not.toBeNull();
  });

  it('logs in an active user with valid credentials', async () => {
    const repository = new InMemoryUserRepository();
    const passwordHash = await hashValue('StrongPass123');
    const user = new User({
      id: 'fe0c3b89-a494-4b6c-bca8-33e68807c762',
      email: 'ops@example.com',
      passwordHash,
      firstName: 'Ops',
      lastName: 'Lead',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      refreshTokenVersion: 0,
      emailVerified: true,
      preferences: {
        marketingOptIn: false,
        preferredLanguage: 'en',
        smsNotifications: true,
        emailNotifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await repository.create(user);

    const useCase = new LoginUseCase(repository, jwtService);
    const result = await useCase.execute({ email: 'ops@example.com', password: 'StrongPass123' });

    expect(result.user.id).toBe(user.id);
    expect(result.tokens.refreshToken).toBeTruthy();
  });

  it('rejects invalid credentials', async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new LoginUseCase(repository, jwtService);

    await expect(useCase.execute({ email: 'missing@example.com', password: 'StrongPass123' })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
