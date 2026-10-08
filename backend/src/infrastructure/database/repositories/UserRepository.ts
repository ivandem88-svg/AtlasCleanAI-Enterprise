import { Prisma, User as PrismaUser } from '@prisma/client';

import { prisma } from '../../../config/database';
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

const toDomain = (record: PrismaUser): User =>
  new User({
    id: record.id,
    email: record.email,
    passwordHash: record.passwordHash,
    firstName: record.firstName,
    lastName: record.lastName,
    phone: record.phone ?? undefined,
    role: record.role,
    status: record.status,
    address: (record.address as Record<string, unknown> | null | undefined) as any,
    refreshTokenVersion: record.refreshTokenVersion,
    emailVerified: record.emailVerified,
    preferences: record.preferences as any,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return record ? toDomain(record) : null;
  }

  async create(user: User): Promise<User> {
    const record = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        address: user.address?.toJSON() as unknown as Prisma.InputJsonValue,
        refreshTokenVersion: user.refreshTokenVersion,
        emailVerified: user.emailVerified,
        preferences: user.preferences as unknown as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }

  async update(user: User): Promise<User> {
    const record = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        address: user.address?.toJSON() as unknown as Prisma.InputJsonValue,
        refreshTokenVersion: user.refreshTokenVersion,
        emailVerified: user.emailVerified,
        preferences: user.preferences as unknown as Prisma.InputJsonValue,
      },
    });

    return toDomain(record);
  }
}
