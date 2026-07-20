import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, COOKIE_MAX_AGE_MS } from '../services/authService.js';
import { env } from '../config/env.js';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

export async function handleRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const { user, token } = await registerUser(data.email, data.password, data.name);
    setAuthCookie(res, token);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const { user, token } = await loginUser(data.email, data.password);
    setAuthCookie(res, token);
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function handleLogout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function handleGetMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}
