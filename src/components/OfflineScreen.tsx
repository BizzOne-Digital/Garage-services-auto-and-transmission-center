import React from 'react';
import { motion } from 'motion/react';
import { Loader2, RefreshCw, Phone, WifiOff } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { BUSINESS_INFO } from '../lib/constants';

/**
 * Full-screen connectivity guard shown over the public site and the admin
 * portal alike. Everything it renders is bundled — no remote logo or font is
 * used, because nothing over the network can load while it is visible.
 *
 * It returns null rather than animating out through AnimatePresence: an exit
 * animation that fails to unmount would leave an invisible full-screen layer
 * swallowing every click once the connection is back. Reappearing instantly is
 * also what people want here — they are waiting to get the page back.
 */
export const OfflineScreen: React.FC = () => {
  const { t } = useLanguage();
  const { online, checking, retry } = useOnlineStatus();

  if (online) return null;

  return (
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-description"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-[10000] bg-[#0A0A0A] text-[#F3F3F3] flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-20" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center">
            <WifiOff className="w-7 h-7 text-[#F5C400]" aria-hidden="true" />
          </div>
        </div>

        <p className="text-[11px] font-mono tracking-widest text-[#F5C400] uppercase mt-6">
          {t.offline.badge}
        </p>

        <h1 id="offline-title" className="text-2xl sm:text-3xl font-bold tracking-tight mt-3">
          {t.offline.title}
        </h1>

        <p
          id="offline-description"
          className="text-sm sm:text-base text-neutral-400 leading-relaxed mt-3"
        >
          {t.offline.description}
        </p>

        <button
          type="button"
          onClick={retry}
          disabled={checking}
          className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 rounded-full bg-[#F5C400] text-[#0A0A0A] text-sm font-semibold tracking-wide transition-colors hover:bg-[#ffd426] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          )}
          {checking ? t.offline.checking : t.offline.retry}
        </button>

        {/* A phone call still works with no data connection. */}
        <div className="mt-10 pt-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500">{t.offline.callPrompt}</p>
          <a
            href={`tel:+1${BUSINESS_INFO.phoneRaw}`}
            className="inline-flex items-center gap-2 mt-2 text-base font-semibold text-[#F3F3F3] transition-colors hover:text-[#F5C400] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] rounded"
          >
            <Phone className="w-4 h-4 text-[#F5C400]" aria-hidden="true" />
            {BUSINESS_INFO.phone}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
