import { ServiceMeta } from '../types';

/**
 * Language-independent business data. All user-facing copy lives in src/i18n.
 */
export const BUSINESS_INFO = {
  shortName: "Garage Services",
  contactPerson: "Abdul",
  phone: "(514) 553-4206",
  phoneRaw: "5145534206",
  email: "Servicesauto786@gmail.com",
  socialMediaName: "garage services auto and transmission center",
  logoUrl: "https://res.cloudinary.com/dobtsjhb2/image/upload/v1787785423/image_cx6qfr.png",
};

/** Ordering, category and icon of each service. Copy lives in i18n (services.items). */
export const SERVICE_META: ServiceMeta[] = [
  { id: "auto-repair", category: "mechanical", iconName: "Wrench" },
  { id: "transmission-services", category: "transmission", iconName: "Cpu" },
  { id: "transmission-diagnostics", category: "transmission", iconName: "Activity" },
  { id: "brake-services", category: "mechanical", iconName: "Disc" },
  { id: "engine-services", category: "mechanical", iconName: "Flame" },
  { id: "preventive-maintenance", category: "maintenance", iconName: "CheckCircle2" },
];

/** Trust pillars: icon + dictionary key. Copy lives in i18n (trustBar.pillars). */
export const TRUST_PILLAR_META: { key: 'professional' | 'pricing' | 'transmission' | 'customer'; iconName: string }[] = [
  { key: "professional", iconName: "ShieldCheck" },
  { key: "pricing", iconName: "BadgeDollarSign" },
  { key: "transmission", iconName: "Cog" },
  { key: "customer", iconName: "HeartHandshake" },
];

/** Rating / verification flags per testimonial. Copy lives in i18n (testimonials.items). */
export const TESTIMONIAL_META: Record<string, { rating: number; verified: boolean }> = {
  t1: { rating: 5, verified: true },
  t2: { rating: 5, verified: true },
  t3: { rating: 5, verified: true },
};
