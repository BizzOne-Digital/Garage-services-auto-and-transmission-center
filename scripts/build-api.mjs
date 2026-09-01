/**
 * Bundles the Express API into a single JavaScript file for Vercel.
 *
 * Vercel's Node builder transpiles TypeScript file-by-file with
 * `ts.transpileModule` and never rewrites import specifiers, so this project's
 * `./db.ts` style imports would survive into output whose files are emitted as
 * `.js` — every route then fails at import with ERR_MODULE_NOT_FOUND. Switching
 * those to `./db.js` is not a fix either: Vercel traces the *source* tree, and
 * its resolver only appends extensions, so `./db.js` resolves to nothing.
 *
 * Bundling ahead of time removes the whole problem. The function is plain
 * JavaScript with no relative imports left, so Vercel does not run TypeScript
 * over it at all. Dependencies stay external and are traced from node_modules
 * as usual.
 */
import { build } from 'esbuild';

const outfile = 'api/index.js';

await build({
  entryPoints: ['server/vercel.ts'],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  // Keep express/mongoose/etc. external so Vercel traces them from node_modules.
  packages: 'external',
  logLevel: 'info',
  banner: {
    js: '// GENERATED FILE — do not edit. Run `npm run build:api` after changing server/.',
  },
});

console.log(`[build:api] wrote ${outfile}`);
