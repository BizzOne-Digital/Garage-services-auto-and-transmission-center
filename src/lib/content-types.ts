/**
 * Shared content contracts between the Express/Mongo backend (server/),
 * the admin portal (src/admin/) and the public site (src/components/).
 *
 * Every piece of editable copy is bilingual: the site ships FR + EN and the
 * admin portal edits both sides of each field.
 */

export type Locale = 'fr' | 'en';

/** A single piece of copy in both site languages. */
export interface Localized {
  fr: string;
  en: string;
}

/** A localized list (e.g. service feature bullets). */
export interface LocalizedList {
  fr: string[];
  en: string[];
}

export type ServiceCategoryKey = string;

export interface CategoryDTO {
  _id: string;
  key: ServiceCategoryKey;
  label: Localized;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  _id: string;
  slug: string;
  categoryKey: ServiceCategoryKey;
  iconName: string;
  imageUrl: string;
  videoUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  title: Localized;
  shortDesc: Localized;
  fullDesc: Localized;
  features: LocalizedList;
  commonSymptoms: LocalizedList;
  turnaroundTime: Localized;
  idealFor: Localized;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialDTO {
  _id: string;
  key: string;
  name: string;
  role: Localized;
  vehicle: Localized;
  serviceCategory: Localized;
  content: Localized;
  date: Localized;
  rating: number;
  verified: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaqDTO {
  _id: string;
  question: Localized;
  answer: Localized;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrustPillarDTO {
  _id: string;
  key: string;
  iconName: string;
  title: Localized;
  subtitle: Localized;
  description: Localized;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Business identity + section imagery. Stored as a single settings document. */
export interface SettingsDTO {
  _id?: string;
  shortName: string;
  businessName: Localized;
  contactPerson: string;
  phone: string;
  phoneRaw: string;
  email: string;
  socialMediaName: string;
  socialLinks: { label: string; url: string }[];
  logoUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  updatedAt?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export type LeadSource = 'contact-form' | 'quote-modal';

export interface LeadDTO {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  vehicleMakeModel: string;
  vehicleYear: string;
  serviceNeeded: string;
  transmissionType: string;
  urgency: string;
  message: string;
  source: LeadSource;
  language: Locale;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDTO {
  _id: string;
  email: string;
  name: string;
  lastLoginAt: string | null;
}

/** Everything the public website needs, in a single cached payload. */
export interface PublicContent {
  settings: SettingsDTO | null;
  categories: CategoryDTO[];
  services: ServiceDTO[];
  testimonials: TestimonialDTO[];
  faqs: FaqDTO[];
  trustPillars: TrustPillarDTO[];
  generatedAt: string;
}

export interface DashboardStats {
  services: { total: number; published: number; draft: number; featured: number };
  categories: number;
  testimonials: { total: number; published: number };
  faqs: { total: number; published: number };
  trustPillars: number;
  leads: { total: number; new: number; last7Days: number };
  recentServices: Pick<ServiceDTO, '_id' | 'slug' | 'title' | 'published' | 'createdAt' | 'imageUrl' | 'categoryKey'>[];
  recentLeads: Pick<LeadDTO, '_id' | 'fullName' | 'serviceNeeded' | 'status' | 'createdAt' | 'phone'>[];
}

/** Uniform API envelope used by every endpoint. */
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string; fields?: Record<string, string> };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export const EMPTY_LOCALIZED: Localized = { fr: '', en: '' };
export const EMPTY_LOCALIZED_LIST: LocalizedList = { fr: [], en: [] };
