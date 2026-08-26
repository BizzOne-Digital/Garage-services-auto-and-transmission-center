export interface ServiceItem {
  id: string;
  title: string;
  category: 'transmission' | 'mechanical' | 'maintenance';
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  turnaroundTime?: string;
  commonSymptoms?: string[];
  idealFor: string;
}

export interface TrustPillar {
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
}

export interface WhyChoosePoint {
  number: string;
  title: string;
  description: string;
  highlight: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  detail: string;
  iconName: string;
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

export interface TransmissionSymptom {
  id: string;
  name: string;
  severity: 'high' | 'medium' | 'critical';
  description: string;
  recommendation: string;
}
