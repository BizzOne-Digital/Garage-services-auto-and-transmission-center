import { apiRequest, buildQuery } from '../lib/api';
import type {
  AdminUserDTO,
  CategoryDTO,
  DashboardStats,
  FaqDTO,
  LeadDTO,
  Paginated,
  ServiceDTO,
  SettingsDTO,
  TestimonialDTO,
  TrustPillarDTO,
} from '../lib/content-types';

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

/** Thin, typed wrapper around the protected /api/admin endpoints. */
const resource = <T>(name: string) => ({
  list: (query: ListQuery = {}) =>
    apiRequest<Paginated<T>>(`/api/admin/${name}${buildQuery(query)}`),
  get: (id: string) => apiRequest<T>(`/api/admin/${name}/${id}`),
  create: (body: Partial<T>) => apiRequest<T>(`/api/admin/${name}`, { method: 'POST', body }),
  update: (id: string, body: Partial<T>) =>
    apiRequest<T>(`/api/admin/${name}/${id}`, { method: 'PATCH', body }),
  remove: (id: string) =>
    apiRequest<{ deleted: boolean }>(`/api/admin/${name}/${id}`, { method: 'DELETE' }),
});

export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest<AdminUserDTO>('/api/admin/auth/login', {
        method: 'POST',
        body: { email, password },
      }),
    logout: () => apiRequest<{ ok: boolean }>('/api/admin/auth/logout', { method: 'POST' }),
    me: () => apiRequest<AdminUserDTO>('/api/admin/auth/me'),
    changePassword: (currentPassword: string, nextPassword: string) =>
      apiRequest<{ updated: boolean }>('/api/admin/auth/password', {
        method: 'POST',
        body: { currentPassword, nextPassword },
      }),
  },

  stats: () => apiRequest<DashboardStats>('/api/admin/stats'),

  services: resource<ServiceDTO>('services'),
  categories: resource<CategoryDTO>('categories'),
  testimonials: resource<TestimonialDTO>('testimonials'),
  faqs: resource<FaqDTO>('faqs'),
  trustPillars: resource<TrustPillarDTO>('trust-pillars'),

  settings: {
    get: () => apiRequest<SettingsDTO | null>('/api/admin/settings'),
    save: (body: Partial<SettingsDTO>) =>
      apiRequest<SettingsDTO>('/api/admin/settings', { method: 'PUT', body }),
  },

  leads: {
    list: (query: ListQuery = {}) => apiRequest<Paginated<LeadDTO>>(`/api/admin/leads${buildQuery(query)}`),
    update: (id: string, body: { status?: string; notes?: string }) =>
      apiRequest<LeadDTO>(`/api/admin/leads/${id}`, { method: 'PATCH', body }),
    remove: (id: string) =>
      apiRequest<{ deleted: boolean }>(`/api/admin/leads/${id}`, { method: 'DELETE' }),
  },

};
