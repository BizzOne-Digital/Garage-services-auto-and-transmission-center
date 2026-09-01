import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type NextFunction, type Request, type Response } from 'express';
import { connectToDatabase, isDatabaseReady } from './db.ts';
import { env } from './env.ts';
import { HttpError } from './http.ts';
import { adminRouter } from './routes/admin.ts';
import { authRouter } from './routes/auth.ts';
import { publicRouter } from './routes/public.ts';
import { ensureAdminUser, ensureAdminUserOnce } from './seed.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

export interface CreateAppOptions {
  /**
   * Serve the built SPA from ./dist. True in production for the standalone
   * Node server; false on serverless platforms where the CDN serves the files.
   */
  serveStatic?: boolean;
}

export const createApp = ({ serveStatic = env.isProduction }: CreateAppOptions = {}) => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));
  app.disable('x-powered-by');

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, data: { database: isDatabaseReady() ? 'connected' : 'disconnected' } });
  });

  // Every API request needs the database; fail fast with a clean 503 instead of hanging.
  app.use('/api', (_req, res, next) => {
    connectToDatabase().then(
      () => ensureAdminUserOnce().then(() => next()),
      () => {
        res.status(503).json({
          ok: false,
          error: 'The content service is temporarily unavailable. Please try again shortly.',
        });
      }
    );
  });

  app.use('/api/public', publicRouter);
  app.use('/api/admin/auth', authRouter);
  app.use('/api/admin', adminRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ ok: false, error: 'Endpoint not found.' });
  });

  // In production the same process serves the built SPA (public site + /admin).
  if (serveStatic) {
    app.use(express.static(distDir, { index: false, maxAge: '1h' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  // Central error handler — never leaks stack traces or driver internals.
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ ok: false, error: error.message, fields: error.fields });
      return;
    }
    if ((error as { name?: string })?.name === 'ValidationError') {
      res.status(400).json({ ok: false, error: 'Some fields are invalid. Please review the form.' });
      return;
    }
    console.error('[api] unhandled error:', error);
    res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
  });

  return app;
};

const isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isEntryPoint) {
  const app = createApp();
  app.listen(env.port, async () => {
    console.log(`[api] listening on http://localhost:${env.port}`);
    try {
      await connectToDatabase();
      console.log('[api] MongoDB connected');
      await ensureAdminUser();
    } catch (error) {
      console.error('[api] MongoDB connection failed:', (error as Error).message);
      console.error('[api] Check MONGODB_URI in your .env file. The API will retry per request.');
    }
  });
}
