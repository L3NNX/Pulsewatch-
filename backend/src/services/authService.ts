import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const BCRYPT_SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = '7d';
export const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function registerUser(email: string, password: string, name: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new AppError('An account with this email address already exists.', 409, 'DUPLICATE_EMAIL');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    token,
  };
}
