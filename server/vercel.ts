/**
 * Entry point bundled into the Vercel serverless function.
 *
 * The CDN serves the built SPA from ./dist, so this only handles /api/* (see
 * the rewrites in vercel.json) and never serves files.
 */
import { createApp } from './index.ts';

export default createApp({ serveStatic: false });
