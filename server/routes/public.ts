import { Router } from 'express';
import type { PublicContent } from '../../src/lib/content-types.ts';
import { Category } from '../models/Category.ts';
import { Faq } from '../models/Faq.ts';
import { Lead } from '../models/Lead.ts';
import { Service } from '../models/Service.ts';
import { Setting, SETTINGS_KEY } from '../models/Setting.ts';
import { Testimonial } from '../models/Testimonial.ts';
import { TrustPillar } from '../models/TrustPillar.ts';
import { asyncRoute, badRequest, cleanText, isEmail, sendOk } from '../http.ts';

export const publicRouter = Router();

/* ------------------------------------------------------------------ */
/* Content payload (cached in-process, revalidated every 60s)          */
/* ------------------------------------------------------------------ */

const CACHE_TTL_MS = 60_000;
let cache: { payload: PublicContent; expiresAt: number } | null = null;

/** Called by every admin mutation so editors see their change immediately. */
export const invalidatePublicContentCache = (): void => {
  cache = null;
};

const loadPublicContent = async (): Promise<PublicContent> => {
  if (cache && cache.expiresAt > Date.now()) return cache.payload;

  const [settings, categories, services, testimonials, faqs, trustPillars] = await Promise.all([
    Setting.findOne({ singleton: SETTINGS_KEY }).lean(),
    Category.find({ published: true }).sort({ order: 1 }).lean(),
    Service.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Testimonial.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Faq.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    TrustPillar.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
  ]);

  const payload = JSON.parse(
    JSON.stringify({
      settings: settings ?? null,
      categories,
      services,
      testimonials,
      faqs,
      trustPillars,
      generatedAt: new Date().toISOString(),
    })
  ) as PublicContent;

  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  return payload;
};

publicRouter.get(
  '/content',
  asyncRoute(async (_req, res) => {
    const content = await loadPublicContent();
    // Public content only; nothing here is admin- or credential-related.
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    sendOk(res, content);
  })
);

/* ------------------------------------------------------------------ */
/* Lead capture                                                        */
/* ------------------------------------------------------------------ */

const leadRateLimit = new Map<string, { count: number; firstAt: number }>();
const LEAD_WINDOW_MS = 10 * 60 * 1000;
const LEAD_MAX = 10;

const isRateLimited = (ip: string): boolean => {
  const entry = leadRateLimit.get(ip);
  if (!entry || Date.now() - entry.firstAt > LEAD_WINDOW_MS) {
    leadRateLimit.set(ip, { count: 1, firstAt: Date.now() });
    return false;
  }
  entry.count += 1;
  return entry.count > LEAD_MAX;
};

publicRouter.post(
  '/leads',
  asyncRoute(async (req, res) => {
    const ip = req.ip || 'unknown';
    if (isRateLimited(ip)) {
      throw badRequest('Too many requests. Please call us directly or try again shortly.');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const fullName = cleanText(body.fullName, 120);
    const phone = cleanText(body.phone, 40);
    const email = cleanText(body.email, 160).toLowerCase();
    const vehicleMakeModel = cleanText(body.vehicleMakeModel, 120);

    const fields: Record<string, string> = {};
    if (!fullName) fields.fullName = 'Full name is required.';
    if (!phone || phone.replace(/\D/g, '').length < 10) fields.phone = 'A valid phone number is required.';
    if (!email || !isEmail(email)) fields.email = 'A valid email address is required.';
    if (Object.keys(fields).length) throw badRequest('Please review the highlighted fields.', fields);

    const source = body.source === 'quote-modal' ? 'quote-modal' : 'contact-form';
    const language = body.language === 'en' ? 'en' : 'fr';

    const lead = await Lead.create({
      fullName,
      phone,
      email,
      vehicleMakeModel,
      vehicleYear: cleanText(body.vehicleYear, 12),
      serviceNeeded: cleanText(body.serviceNeeded, 80),
      transmissionType: cleanText(body.transmissionType, 60),
      urgency: cleanText(body.urgency, 40),
      message: cleanText(body.message, 4_000),
      source,
      language,
    });

    // Never echo the stored document back to an anonymous caller.
    sendOk(res, { id: String(lead._id), received: true }, 201);
  })
);
