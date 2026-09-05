import { navigate } from './router';

/**
 * Scrolls to an in-page section (`#about`, `#services`, …).
 *
 * The public site is one page, so on `/` this is a plain smooth scroll. From a
 * separate route such as `/blog` it first navigates home client-side, then waits
 * for the section to exist before scrolling.
 */
export const scrollToSection = (hash: string): void => {
  const scroll = () => {
    const element = document.querySelector(hash);
    if (!element) return false;
    element.scrollIntoView({ behavior: 'smooth' });
    return true;
  };

  if (window.location.pathname === '/') {
    scroll();
    return;
  }

  navigate('/');

  // The home sections mount on the next render; retry briefly instead of
  // guessing a single timeout.
  let attempts = 0;
  const retry = () => {
    if (scroll() || attempts > 40) return;
    attempts += 1;
    requestAnimationFrame(retry);
  };
  requestAnimationFrame(retry);
};
