import { useCallback, useEffect, useRef, useState } from 'react';

/** How often to re-check while the browser still reports no usable connection. */
const RETRY_INTERVAL_MS = 5000;
const PROBE_TIMEOUT_MS = 8000;

/**
 * Confirms the origin is actually reachable.
 *
 * `navigator.onLine === true` only means a network interface exists — it is
 * still true on a captive portal or a router with no upstream. A real request
 * is the only way to be sure, so recovery is always verified before the
 * offline screen is dismissed.
 */
const probeConnection = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    // The document root always exists in dev and in production, and unlike the
    // API it stays reachable even when the database or backend is down.
    await fetch(`${window.location.origin}/?connectivity=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

export interface OnlineStatus {
  /** False only when the connection has been confirmed unusable. */
  online: boolean;
  /** True while a reachability check is in flight. */
  checking: boolean;
  /** Re-checks immediately; wired to the "Try again" button. */
  retry: () => void;
}

/**
 * Tracks real connectivity.
 *
 * `navigator.onLine === false` is trusted immediately — browsers only report it
 * when there is no route at all. Going back online is verified with a request
 * so the screen never disappears onto a page that still cannot load anything.
 */
export const useOnlineStatus = (): OnlineStatus => {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [checking, setChecking] = useState(false);

  // Guards against overlapping probes from the retry button, the interval and
  // the browser's own online event all firing at once.
  const probing = useRef(false);

  const verify = useCallback(async () => {
    if (probing.current) return;
    probing.current = true;
    setChecking(true);
    const reachable = await probeConnection();
    probing.current = false;
    setChecking(false);
    setOnline(reachable);
  }, []);

  useEffect(() => {
    const handleOffline = () => setOnline(false);
    const handleOnline = () => {
      void verify();
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [verify]);

  // Keep polling while offline: a captive portal or a flaky hotspot can come
  // back without the browser ever firing an `online` event.
  useEffect(() => {
    if (online) return;
    const id = setInterval(() => {
      if (navigator.onLine) void verify();
    }, RETRY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [online, verify]);

  const retry = useCallback(() => {
    void verify();
  }, [verify]);

  return { online, checking, retry };
};
