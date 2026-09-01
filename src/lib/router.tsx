import React, { useCallback, useEffect, useState } from 'react';

/**
 * Minimal History-API router used only by the admin portal.
 *
 * The public site is a single page with in-page anchors and stays exactly as it
 * was — adding a routing library for one isolated area would be overkill.
 */

const NAVIGATION_EVENT = 'gsa:navigate';

export const navigate = (to: string, options: { replace?: boolean } = {}): void => {
  if (options.replace) window.history.replaceState({}, '', to);
  else window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
};

/** Current pathname, kept in sync with back/forward and `navigate`. */
export const usePathname = (): string => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATION_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATION_EVENT, sync);
    };
  }, []);

  return pathname;
};

/**
 * Matches `/admin/services/:id/edit` style patterns and returns the params,
 * or null when the pattern does not apply.
 */
export const matchRoute = (
  pattern: string,
  pathname: string
): Record<string, string> | null => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = pathParts[index];
    if (expected.startsWith(':')) params[expected.slice(1)] = decodeURIComponent(actual);
    else if (expected !== actual) return null;
  }
  return params;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

/** Anchor that navigates client-side but still behaves like a real link. */
export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      // Let the browser handle modified clicks (new tab, download, …).
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      navigate(to, { replace });
    },
    [to, replace, onClick]
  );

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
