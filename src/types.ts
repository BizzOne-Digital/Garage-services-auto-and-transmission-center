export type ServiceCategory = 'transmission' | 'mechanical' | 'maintenance';

/** Language-independent structure of a service (kept in lib/constants.ts). */
export interface ServiceMeta {
  id: string;
  category: ServiceCategory;
  iconName: string;
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
