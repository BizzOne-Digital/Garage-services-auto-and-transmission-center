/**
 * Vercel serverless entry point for the Express API.
 *
 * On Vercel the built SPA is served from ./dist by the CDN, so this function
 * only handles /api/* (see the rewrites in vercel.json) and never serves files.
 */
import { createApp } from '../server/index.ts';

export default createApp({ serveStatic: false });
