import { Router } from 'express';
import { AdminUser } from '../models/AdminUser.ts';
import {
  clearLoginAttempts,
  clearSessionCookie,
  createSessionToken,
  isLoginBlocked,
  readAdminSession,
  registerFailedLogin,
  requireAdmin,
  setSessionCookie,
  verifyPassword,
} from '../auth.ts';
import { asyncRoute, badRequest, cleanText, HttpError, sendOk, unauthorized } from '../http.ts';

export const authRouter = Router();

authRouter.post(
  '/login',
  asyncRoute(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = cleanText(body.email, 160).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      throw badRequest('Email and password are required.', {
        ...(email ? {} : { email: 'Email is required.' }),
        ...(password ? {} : { password: 'Password is required.' }),
      });
    }

    const throttleKey = `${req.ip || 'unknown'}:${email}`;
    if (isLoginBlocked(throttleKey)) {
      throw new HttpError(429, 'Too many failed attempts. Please wait a few minutes and try again.');
    }

    const user = await AdminUser.findOne({ email }).select('+passwordHash');

    // Identical response for unknown email and wrong password.
    if (!user || !verifyPassword(password, user.passwordHash)) {
      registerFailedLogin(throttleKey);
      throw unauthorized('Invalid email or password.');
    }

    clearLoginAttempts(throttleKey);
    user.lastLoginAt = new Date();
    await user.save();

    setSessionCookie(res, createSessionToken({ sub: String(user._id), email: user.email, name: user.name }));
    sendOk(res, { _id: String(user._id), email: user.email, name: user.name, lastLoginAt: null });
  })
);

authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  sendOk(res, { ok: true });
});

authRouter.get(
  '/me',
  asyncRoute(async (req, res) => {
    const session = readAdminSession(req);
    if (!session) throw unauthorized();
    const user = await AdminUser.findById(session.sub).lean();
    if (!user) {
      clearSessionCookie(res);
      throw unauthorized();
    }
    sendOk(res, {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null,
    });
  })
);

authRouter.post(
  '/password',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    const nextPassword = typeof body.nextPassword === 'string' ? body.nextPassword : '';

    if (nextPassword.length < 10) {
      throw badRequest('Password must be at least 10 characters.', {
        nextPassword: 'Use at least 10 characters.',
      });
    }

    const user = await AdminUser.findById(req.admin!.sub).select('+passwordHash');
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      throw badRequest('Current password is incorrect.', { currentPassword: 'Incorrect password.' });
    }

    const { hashPassword } = await import('../auth.ts');
    user.passwordHash = hashPassword(nextPassword);
    await user.save();
    sendOk(res, { updated: true });
  })
);
