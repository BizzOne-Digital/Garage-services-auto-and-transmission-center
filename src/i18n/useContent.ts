import { useMemo } from 'react';
import { useSiteContent } from '../content/SiteContentContext';
import { BUSINESS_INFO, SERVICE_META, TESTIMONIAL_META, TRUST_PILLAR_META } from '../lib/constants';
import type { Localized, LocalizedList } from '../lib/content-types';
import { ServiceItem, SiteBusinessInfo, SiteCategory, SiteFaq, Testimonial, TrustPillar } from '../types';
import { useLanguage, type Language } from './LanguageContext';

/**
 * Content resolution order for every section:
 *   1. published documents from MongoDB (managed in /admin), when available
 *   2. the bundled FR/EN dictionaries, so the site never renders empty
 *      while the API is loading, unreachable or not yet seeded.
 */

const pick = (value: Localized | undefined, lang: Language, fallback = ''): string =>
  (value?.[lang] || value?.fr || value?.en || fallback).trim();

const pickList = (value: LocalizedList | undefined, lang: Language): string[] => {
  const list = value?.[lang]?.length ? value[lang] : value?.fr?.length ? value.fr : value?.en;
  return list ?? [];
};

/** Images and business identity, with the bundled constants as the fallback. */
export const useBusiness = (): SiteBusinessInfo => {
  const { content } = useSiteContent();
  const settings = content?.settings ?? null;

  return useMemo(
    () => ({
      shortName: settings?.shortName || BUSINESS_INFO.shortName,
      contactPerson: settings?.contactPerson || BUSINESS_INFO.contactPerson,
      phone: settings?.phone || BUSINESS_INFO.phone,
      phoneRaw: settings?.phoneRaw || BUSINESS_INFO.phoneRaw,
      email: settings?.email || BUSINESS_INFO.email,
      socialMediaName: settings?.socialMediaName || BUSINESS_INFO.socialMediaName,
      logoUrl: settings?.logoUrl || BUSINESS_INFO.logoUrl,
      heroImageUrl: settings?.heroImageUrl || BUSINESS_INFO.heroImageUrl,
      aboutImageUrl: settings?.aboutImageUrl || BUSINESS_INFO.aboutImageUrl,
      socialLinks: settings?.socialLinks ?? [],
    }),
    [settings]
  );
};

/** Services in display order, from the database when seeded. */
export const useServices = (): ServiceItem[] => {
  const { t, lang } = useLanguage();
  const { content } = useSiteContent();

  return useMemo(() => {
    const fromDb = content?.services ?? [];
    if (fromDb.length) {
      return fromDb.map(service => ({
        id: service.slug,
        category: service.categoryKey,
        iconName: service.iconName,
        imageUrl: service.imageUrl,
        videoUrl: service.videoUrl,
        featured: service.featured,
        title: pick(service.title, lang),
        shortDesc: pick(service.shortDesc, lang),
        fullDesc: pick(service.fullDesc, lang),
        features: pickList(service.features, lang),
        commonSymptoms: pickList(service.commonSymptoms, lang),
        turnaroundTime: pick(service.turnaroundTime, lang) || undefined,
        idealFor: pick(service.idealFor, lang),
      }));
    }

    return SERVICE_META.map(meta => ({
      ...meta,
      ...t.services.items[meta.id as keyof typeof t.services.items],
    }));
  }, [content, lang, t]);
};

/** Service category filter tabs. */
export const useCategories = (): SiteCategory[] => {
  const { t, lang } = useLanguage();
  const { content } = useSiteContent();

  return useMemo(() => {
    const fromDb = content?.categories ?? [];
    if (fromDb.length) {
      return fromDb.map(category => ({ key: category.key, label: pick(category.label, lang, category.key) }));
    }
    return [
      { key: 'transmission', label: t.services.filters.transmission },
      { key: 'mechanical', label: t.services.filters.mechanical },
      { key: 'maintenance', label: t.services.filters.maintenance },
    ];
  }, [content, lang, t]);
};

/** Trust pillars in display order. */
export const useTrustPillars = (): TrustPillar[] => {
  const { t, lang } = useLanguage();
  const { content } = useSiteContent();

  return useMemo(() => {
    const fromDb = content?.trustPillars ?? [];
    if (fromDb.length) {
      return fromDb.map(pillar => ({
        iconName: pillar.iconName,
        title: pick(pillar.title, lang),
        subtitle: pick(pillar.subtitle, lang),
        description: pick(pillar.description, lang),
      }));
    }
    return TRUST_PILLAR_META.map(meta => ({ iconName: meta.iconName, ...t.trustBar.pillars[meta.key] }));
  }, [content, lang, t]);
};

/** Testimonials with rating / verification flags. */
export const useTestimonials = (): Testimonial[] => {
  const { t, lang } = useLanguage();
  const { content } = useSiteContent();

  return useMemo(() => {
    const fromDb = content?.testimonials ?? [];
    if (fromDb.length) {
      return fromDb.map(item => ({
        id: item.key || item._id,
        name: item.name,
        role: pick(item.role, lang),
        vehicle: pick(item.vehicle, lang),
        serviceCategory: pick(item.serviceCategory, lang),
        rating: item.rating,
        content: pick(item.content, lang),
        date: pick(item.date, lang),
        verified: item.verified,
      }));
    }
    return t.testimonials.items.map(item => ({
      ...item,
      ...(TESTIMONIAL_META[item.id] ?? { rating: 5, verified: true }),
    }));
  }, [content, lang, t]);
};

/** Pricing-section FAQs. */
export const useFaqs = (): SiteFaq[] => {
  const { t, lang } = useLanguage();
  const { content } = useSiteContent();

  return useMemo(() => {
    const fromDb = content?.faqs ?? [];
    if (fromDb.length) {
      return fromDb.map(faq => ({ q: pick(faq.question, lang), a: pick(faq.answer, lang) }));
    }
    return t.pricing.faqs.map(faq => ({ q: faq.q, a: faq.a }));
  }, [content, lang, t]);
};
