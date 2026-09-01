import type { LeadFormData } from '../types';
import type { Language } from '../i18n/LanguageContext';
import { ApiError, apiRequest } from './api';

export type LeadSubmissionSource = 'contact-form' | 'quote-modal';

/**
 * Sends a quote request to the API, where it is stored in MongoDB and shows up
 * in the admin Leads inbox. Field-level messages come back from the server.
 */
export const submitLead = async (
  data: LeadFormData,
  source: LeadSubmissionSource,
  language: Language
): Promise<void> => {
  await apiRequest<{ id: string; received: boolean }>('/api/public/leads', {
    method: 'POST',
    body: { ...data, source, language },
  });
};

export { ApiError };
