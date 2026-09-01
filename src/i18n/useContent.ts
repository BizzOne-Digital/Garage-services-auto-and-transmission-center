import { useMemo } from 'react';
import { SERVICE_META, TESTIMONIAL_META, TRUST_PILLAR_META } from '../lib/constants';
import { ServiceItem, Testimonial, TrustPillar } from '../types';
import { useLanguage } from './LanguageContext';

/** Services in display order, merging structure (constants) with translated copy (i18n). */
export const useServices = (): ServiceItem[] => {
  const { t } = useLanguage();
  return useMemo(
    () => SERVICE_META.map(meta => ({ ...meta, ...t.services.items[meta.id as keyof typeof t.services.items] })),
    [t]
  );
};

/** Trust pillars in display order with translated copy. */
export const useTrustPillars = (): TrustPillar[] => {
  const { t } = useLanguage();
  return useMemo(
    () => TRUST_PILLAR_META.map(meta => ({ iconName: meta.iconName, ...t.trustBar.pillars[meta.key] })),
    [t]
  );
};

/** Testimonials with translated copy plus rating / verification flags. */
export const useTestimonials = (): Testimonial[] => {
  const { t } = useLanguage();
  return useMemo(
    () => t.testimonials.items.map(item => ({ ...item, ...(TESTIMONIAL_META[item.id] ?? { rating: 5, verified: true }) })),
    [t]
  );
};
