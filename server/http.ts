import type { NextFunction, Request, Response } from 'express';
import type { Localized, LocalizedList } from '../src/lib/content-types.ts';

/** Thrown by route handlers to produce a controlled, non-leaky error response. */
export class HttpError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export const badRequest = (message: string, fields?: Record<string, string>) =>
  new HttpError(400, message, fields);
export const unauthorized = (message = 'Authentication required.') => new HttpError(401, message);
export const notFound = (message = 'Record not found.') => new HttpError(404, message);
export const conflict = (message: string, fields?: Record<string, string>) =>
  new HttpError(409, message, fields);

export const sendOk = <T>(res: Response, data: T, status = 200): void => {
  res.status(status).json({ ok: true, data });
};

/** Wraps an async handler so rejections reach the central error middleware. */
export const asyncRoute =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };

/* ------------------------------------------------------------------ */
/* Input validation / sanitisation                                     */
/* ------------------------------------------------------------------ */

const MAX_TEXT = 5_000;

/** Trims, collapses control characters and caps the length of untrusted text. */
export const cleanText = (value: unknown, maxLength = MAX_TEXT): string => {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
};

export const cleanBool = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export const cleanNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const cleanLocalized = (value: unknown, maxLength = MAX_TEXT): Localized => {
  const source = (value ?? {}) as Partial<Localized>;
  return { fr: cleanText(source.fr, maxLength), en: cleanText(source.en, maxLength) };
};

export const cleanLocalizedList = (value: unknown, maxItems = 24): LocalizedList => {
  const source = (value ?? {}) as Partial<LocalizedList>;
  const list = (input: unknown): string[] =>
    Array.isArray(input)
      ? input.map(entry => cleanText(entry, 400)).filter(Boolean).slice(0, maxItems)
      : [];
  return { fr: list(source.fr), en: list(source.en) };
};

/** Only http(s) and data: image URLs are allowed anywhere in the CMS. */
export const cleanUrl = (value: unknown): string => {
  const raw = cleanText(value, 2_000);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^data:(image|video)\//i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  throw badRequest('URLs must start with http://, https:// or /.');
};

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Escapes user input before it is used inside a MongoDB regular expression. */
const REGEX_SPECIAL_CHARS = new Set(['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\']);

export const escapeRegex = (value: string): string =>
  Array.from(value)
    .map(char => (REGEX_SPECIAL_CHARS.has(char) ? `\\${char}` : char))
    .join('');
