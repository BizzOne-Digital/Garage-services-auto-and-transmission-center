/**
 * Category keys are managed from the admin portal, so this is a plain string.
 * The three keys shipped with the site are 'transmission' | 'mechanical' | 'maintenance'.
 */
export type ServiceCategory = string;

/** Language-independent structure of a service (from MongoDB, or lib/constants.ts). */
export interface ServiceMeta {
  id: string;
  category: ServiceCategory;
  iconName: string;
  /** Optional media managed from /admin/services. */
  imageUrl?: string;
  videoUrl?: string;
  featured?: boolean;
}

/** Translated copy for a service (kept in the i18n dictionaries). */
export interface ServiceContent {
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  turnaroundTime?: string;
  commonSymptoms?: string[];
  idealFor: string;
}

export type ServiceItem = ServiceMeta & ServiceContent;

export interface TrustPillar {
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  vehicle: string;
  serviceCategory: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
}

export interface LeadFormData {
  fullName: string;
  phone: string;
  email: string;
  vehicleMakeModel: string;
  vehicleYear: string;
  serviceNeeded: string;
  transmissionType: string;
  urgency: string;
  message: string;
}

/** Business identity resolved from the database, falling back to lib/constants.ts. */
export interface SiteBusinessInfo {
  shortName: string;
  contactPerson: string;
  phone: string;
  phoneRaw: string;
  email: string;
  socialMediaName: string;
  logoUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  socialLinks: { label: string; url: string }[];
}

/** A service category filter tab. */
export interface SiteCategory {
  key: string;
  label: string;
}

/** A pricing-section FAQ entry. */
export interface SiteFaq {
  q: string;
  a: string;
}
