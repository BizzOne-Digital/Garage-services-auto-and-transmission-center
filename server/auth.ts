import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env } from './env.ts';
import { unauthorized } from './http.ts';

export const SESSION_COOKIE = 'gsa_admin_session';

const SCRYPT_KEYLEN = 64;

/* ------------------------------------------------------------------ */
/* Password hashing (scrypt, from the Node standard library)           */
/* ------------------------------------------------------------------ */

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  const [scheme, saltHex, hashHex] = (stored || '').split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  let derived: Buffer;
  try {
    derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  } catch {
    return false;
  }
  return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
};

/* ------------------------------------------------------------------ */
/* Stateless signed session cookie                                     */
/* ------------------------------------------------------------------ */

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

const b64url = (input: Buffer | string): string =>
  Buffer.from(input).toString('base64url');

const sign = (value: string): string =>
  crypto.createHmac('sha256', env.authSecret).update(value).digest('base64url');

export const createSessionToken = (payload: Omit<SessionPayload, 'exp'>): string => {
  const exp = Date.now() + env.sessionTtlDays * 24 * 60 * 60 * 1000;
  const body = b64url(JSON.stringify({ ...payload, exp }));
  return `${body}.${sign(body)}`;
};

export const readSessionToken = (token: string | undefined): SessionPayload | null => {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.sub || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* Cookie helpers (express 4 does not parse cookies on its own)        */
/* ------------------------------------------------------------------ */

const parseCookies = (header: string | undefined): Record<string, string> => {
  const jar: Record<string, string> = {};
  if (!header) return jar;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (key) jar[key] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return jar;
};

export const setSessionCookie = (res: Response, token: string): void => {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/',
    maxAge: env.sessionTtlDays * 24 * 60 * 60 * 1000,
  });
};

export const clearSessionCookie = (res: Response): void => {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/',
  });
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: SessionPayload;
    }
  }
}

/** Rejects every admin API request that does not carry a valid session cookie. */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  const cookies = parseCookies(req.headers.cookie);
  const session = readSessionToken(cookies[SESSION_COOKIE]);
  if (!session) {
    next(unauthorized());
    return;
  }
  req.admin = session;
  next();
};

export const readAdminSession = (req: Request): SessionPayload | null =>
  readSessionToken(parseCookies(req.headers.cookie)[SESSION_COOKIE]);

/* ------------------------------------------------------------------ */
/* Login throttling (in-memory, per process)                           */
/* ------------------------------------------------------------------ */

const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export const registerFailedLogin = (key: string): void => {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
};

export const isLoginBlocked = (key: string): boolean => {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
};

export const clearLoginAttempts = (key: string): void => {
  attempts.delete(key);
};
