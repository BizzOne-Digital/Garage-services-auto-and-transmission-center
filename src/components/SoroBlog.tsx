import React, { useEffect, useRef } from 'react';

/**
 * Soro blog / SEO embed.
 *
 * Soro serves a single script that looks up `#soro-blog` and renders the
 * published articles into it. The script is injected imperatively (never as a
 * `<script>` tag inside JSX, which React does not execute) and is attached only
 * while the blog page is mounted, so client-side navigation can never end up
 * with two copies of it.
 */

const SORO_EMBED_SRC =
  'https://app.trysoro.com/api/embed/8096d0e2-0542-4779-80bd-884817f1806c';

const SORO_SCRIPT_ID = 'soro-embed-script';

const readMeta = (selector: string): string =>
  document.head.querySelector<HTMLMetaElement>(selector)?.content ?? '';

const writeMeta = (selector: string, content: string): void => {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el && content && el.content !== content) el.content = content;
};

/**
 * Soro writes the article's own <title> and meta description on /blog?post=…,
 * but not the Open Graph / Twitter equivalents. Mirror them so shared article
 * links show the article rather than the generic site card.
 */
const syncSocialMeta = (): void => {
  const title = document.title;
  const description = readMeta('meta[name="description"]');
  writeMeta('meta[property="og:title"]', title);
  writeMeta('meta[name="twitter:title"]', title);
  writeMeta('meta[property="og:description"]', description);
  writeMeta('meta[name="twitter:description"]', description);
};

export const SoroBlog: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Already present (e.g. a second instance on the page) — do not load twice.
    if (document.getElementById(SORO_SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SORO_SCRIPT_ID;
    script.src = SORO_EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);

    // The embed updates the head asynchronously once the article is fetched.
    const observer = new MutationObserver(syncSocialMeta);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      script.remove();
      // The embed owns the container's children; clear them so a later mount
      // starts from a clean slate instead of stacking a second render.
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div id="soro-blog" ref={containerRef} />;
};
