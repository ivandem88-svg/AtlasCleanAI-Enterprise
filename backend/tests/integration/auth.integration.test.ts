import request from 'supertest';

import { createApp } from '../../src/app';
import { User } from '../../src/domain/entities/User';
import { IUserRepository } from '../../src/domain/repositories/IUserRepository';
import { EmailService } from '../../src/infrastructure/services/EmailService';

class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();
  async findById(id: string): Promise<User | null> { return this.users.get(id) ?? null; }
  async findByEmail(email: string): Promise<User | null> { return Array.from(this.users.values()).find((user) => user.email === email.toLowerCase()) ?? null; }
  async create(user: User): Promise<User> { this.users.set(user.id, user); return user; }
  async update(user: User): Promise<User> { this.users.set(user.id, user); return user; }
}

class EmailServiceStub {
  async sendWelcomeEmail(): Promise<void> {}
  async sendMail(): Promise<void> {}
}

describe('Auth routes', () => {
  it('registers a user through HTTP', async () => {
    const app = createApp({
      userRepository: new InMemoryUserRepository() as any,
      emailService: new EmailServiceStub() as unknown as EmailService,
    });

    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'http@example.com',
      password: 'StrongPass123',
      firstName: 'Http',
      lastName: 'Tester',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.tokens.accessToken).toBeTruthy();
  });
});
