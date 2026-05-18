import prisma from '../db/prisma.client';
import { hashPassword } from '../utils/password.utils';
import { UserPublic } from '../types/user.types';

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
}): Promise<UserPublic> {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({
    data: { email: data.email, name: data.name, password: hashed },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function emailExists(email: string): Promise<boolean> {
  const count = await prisma.user.count({ where: { email } });
  return count > 0;
}
