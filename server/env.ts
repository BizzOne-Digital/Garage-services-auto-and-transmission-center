import 'dotenv/config';

const required = (name: string, value: string | undefined): string => {
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`
    );
  }
  return value.trim();
};

const optional = (value: string | undefined, fallback = ''): string => (value ?? fallback).trim();

export const env = {
  nodeEnv: optional(process.env.NODE_ENV, 'development'),
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  port: Number(optional(process.env.PORT, '4000')),

  /** Never hardcoded — always read from the environment. */
  get mongodbUri(): string {
    return required('MONGODB_URI', process.env.MONGODB_URI);
  },
  mongodbDbName: optional(process.env.MONGODB_DB_NAME),

  /** Seed / bootstrap credentials for the first admin account. */
  get adminEmail(): string {
    return required('ADMIN_EMAIL', process.env.ADMIN_EMAIL).toLowerCase();
  },
  get adminPassword(): string {
    return required('ADMIN_PASSWORD', process.env.ADMIN_PASSWORD);
  },
  adminName: optional(process.env.ADMIN_NAME, 'Administrator'),

  /** Secret used to sign the admin session cookie. */
  get authSecret(): string {
    return required('AUTH_SECRET', process.env.AUTH_SECRET);
  },
  sessionTtlDays: Number(optional(process.env.SESSION_TTL_DAYS, '7')),

  siteUrl: optional(process.env.SITE_URL, 'http://localhost:3000'),

  cloudinary: {
    cloudName: optional(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: optional(process.env.CLOUDINARY_API_KEY),
    apiSecret: optional(process.env.CLOUDINARY_API_SECRET),
    folder: optional(process.env.CLOUDINARY_FOLDER, 'garage-services'),
    get configured() {
      return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    },
  },
};
