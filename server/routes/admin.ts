import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../auth.ts';
import { env } from '../env.ts';
import {
  asyncRoute,
  badRequest,
  cleanBool,
  cleanLocalized,
  cleanLocalizedList,
  cleanNumber,
  cleanText,
  cleanUrl,
  escapeRegex,
  notFound,
  sendOk,
  slugify,
} from '../http.ts';
import { Category } from '../models/Category.ts';
import { Faq } from '../models/Faq.ts';
import { Lead } from '../models/Lead.ts';
import { Service } from '../models/Service.ts';
import { Setting, SETTINGS_KEY } from '../models/Setting.ts';
import { Testimonial } from '../models/Testimonial.ts';
import { TrustPillar } from '../models/TrustPillar.ts';
import { createCrudRouter } from './crud.ts';
import { invalidatePublicContentCache } from './public.ts';

export const adminRouter = Router();

// Every route below this line requires a valid admin session cookie.
adminRouter.use(requireAdmin);

/* ------------------------------------------------------------------ */
/* Content collections                                                 */
/* ------------------------------------------------------------------ */

adminRouter.use(
  '/services',
  createCrudRouter({
    model: Service,
    label: 'Service',
    searchFields: ['slug', 'title.fr', 'title.en'],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ['categoryKey', 'published', 'featured'],
    sanitize: (body, isCreate) => {
      const title = cleanLocalized(body.title, 160);
      const slug = slugify(cleanText(body.slug, 90) || title.en || title.fr);
      if (isCreate && !slug) {
        throw badRequest('A slug (or title) is required.', { slug: 'Required.' });
      }

      const doc: Record<string, unknown> = {
        categoryKey: slugify(cleanText(body.categoryKey, 60)) || 'mechanical',
        iconName: cleanText(body.iconName, 40) || 'Wrench',
        imageUrl: cleanUrl(body.imageUrl),
        videoUrl: cleanUrl(body.videoUrl),
        featured: cleanBool(body.featured),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0),
        title,
        shortDesc: cleanLocalized(body.shortDesc, 400),
        fullDesc: cleanLocalized(body.fullDesc, 4000),
        features: cleanLocalizedList(body.features),
        commonSymptoms: cleanLocalizedList(body.commonSymptoms),
        turnaroundTime: cleanLocalized(body.turnaroundTime, 200),
        idealFor: cleanLocalized(body.idealFor, 400),
      };
      if (slug) doc.slug = slug;
      return doc;
    },
  })
);

adminRouter.use(
  '/categories',
  createCrudRouter({
    model: Category,
    label: 'Category',
    searchFields: ['key', 'label.fr', 'label.en'],
    defaultSort: { order: 1 },
    filterFields: ['published'],
    sanitize: (body, isCreate) => {
      const label = cleanLocalized(body.label, 120);
      const key = slugify(cleanText(body.key, 60) || label.en || label.fr);
      if (isCreate && !key) throw badRequest('A category key is required.', { key: 'Required.' });
      const doc: Record<string, unknown> = {
        label,
        order: cleanNumber(body.order, 0),
        published: cleanBool(body.published, true),
      };
      if (key) doc.key = key;
      return doc;
    },
  })
);

adminRouter.use(
  '/testimonials',
  createCrudRouter({
    model: Testimonial,
    label: 'Testimonial',
    searchFields: ['name', 'content.fr', 'content.en'],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ['published'],
    sanitize: (body, isCreate) => {
      const name = cleanText(body.name, 120);
      if (isCreate && !name) throw badRequest('A customer name is required.', { name: 'Required.' });

      const doc: Record<string, unknown> = {
        role: cleanLocalized(body.role, 120),
        vehicle: cleanLocalized(body.vehicle, 120),
        serviceCategory: cleanLocalized(body.serviceCategory, 160),
        content: cleanLocalized(body.content, 2000),
        date: cleanLocalized(body.date, 80),
        rating: Math.min(5, Math.max(1, Math.round(cleanNumber(body.rating, 5)))),
        verified: cleanBool(body.verified, true),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0),
      };
      if (name) doc.name = name;
      if (isCreate) {
        doc.key = slugify(cleanText(body.key, 60) || name) || `t-${Date.now().toString(36)}`;
      }
      return doc;
    },
  })
);

adminRouter.use(
  '/faqs',
  createCrudRouter({
    model: Faq,
    label: 'FAQ',
    searchFields: ['question.fr', 'question.en'],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ['published'],
    sanitize: body => ({
      question: cleanLocalized(body.question, 400),
      answer: cleanLocalized(body.answer, 4000),
      published: cleanBool(body.published, true),
      order: cleanNumber(body.order, 0),
    }),
  })
);

adminRouter.use(
  '/trust-pillars',
  createCrudRouter({
    model: TrustPillar,
    label: 'Trust pillar',
    searchFields: ['key', 'title.fr', 'title.en'],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ['published'],
    sanitize: (body, isCreate) => {
      const title = cleanLocalized(body.title, 160);
      const key = slugify(cleanText(body.key, 60) || title.en || title.fr);
      if (isCreate && !key) throw badRequest('A key is required.', { key: 'Required.' });
      const doc: Record<string, unknown> = {
        iconName: cleanText(body.iconName, 40) || 'ShieldCheck',
        title,
        subtitle: cleanLocalized(body.subtitle, 200),
        description: cleanLocalized(body.description, 600),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0),
      };
      if (key) doc.key = key;
      return doc;
    },
  })
);

/* ------------------------------------------------------------------ */
/* Settings (single document)                                          */
/* ------------------------------------------------------------------ */

adminRouter.get(
  '/settings',
  asyncRoute(async (_req, res) => {
    const settings = await Setting.findOne({ singleton: SETTINGS_KEY }).lean();
    sendOk(res, settings ? JSON.parse(JSON.stringify(settings)) : null);
  })
);

adminRouter.put(
  '/settings',
  asyncRoute(async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const rawLinks = Array.isArray(body.socialLinks) ? body.socialLinks : [];

    const update = {
      shortName: cleanText(body.shortName, 120),
      businessName: cleanLocalized(body.businessName, 200),
      contactPerson: cleanText(body.contactPerson, 120),
      phone: cleanText(body.phone, 40),
      phoneRaw: cleanText(body.phoneRaw, 20).replace(/\D/g, ''),
      email: cleanText(body.email, 160).toLowerCase(),
      socialMediaName: cleanText(body.socialMediaName, 160),
      socialLinks: rawLinks
        .slice(0, 12)
        .map(entry => {
          const link = (entry ?? {}) as Record<string, unknown>;
          return { label: cleanText(link.label, 60), url: cleanUrl(link.url) };
        })
        .filter(link => link.label && link.url),
      logoUrl: cleanUrl(body.logoUrl),
      heroImageUrl: cleanUrl(body.heroImageUrl),
      aboutImageUrl: cleanUrl(body.aboutImageUrl),
    };

    const settings = await Setting.findOneAndUpdate(
      { singleton: SETTINGS_KEY },
      { $set: update, $setOnInsert: { singleton: SETTINGS_KEY } },
      { returnDocument: 'after', upsert: true, runValidators: true }
    ).lean();

    invalidatePublicContentCache();
    sendOk(res, JSON.parse(JSON.stringify(settings)));
  })
);

/* ------------------------------------------------------------------ */
/* Leads inbox                                                         */
/* ------------------------------------------------------------------ */

const LEAD_STATUSES: readonly string[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

adminRouter.get(
  '/leads',
  asyncRoute(async (req, res) => {
    const page = Math.max(1, cleanNumber(req.query.page, 1));
    const pageSize = Math.min(100, Math.max(1, cleanNumber(req.query.pageSize, 20)));
    const search = cleanText(req.query.search, 120);
    const status = cleanText(req.query.status, 20);

    const filter: Record<string, unknown> = {};
    if (LEAD_STATUSES.includes(status)) filter.status = status;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { fullName: pattern },
        { email: pattern },
        { phone: pattern },
        { vehicleMakeModel: pattern },
      ];
    }

    const [items, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
      Lead.countDocuments(filter),
    ]);

    sendOk(res, {
      items: JSON.parse(JSON.stringify(items)),
      total,
      page,
      pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize)),
    });
  })
);

adminRouter.patch(
  '/leads/:id',
  asyncRoute(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound('Lead not found.');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const status = cleanText(body.status, 20);
    const update: Record<string, unknown> = { notes: cleanText(body.notes, 4000) };
    if (LEAD_STATUSES.includes(status)) update.status = status;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' }).lean();
    if (!lead) throw notFound('Lead not found.');
    sendOk(res, JSON.parse(JSON.stringify(lead)));
  })
);

adminRouter.delete(
  '/leads/:id',
  asyncRoute(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw notFound('Lead not found.');
    const lead = await Lead.findByIdAndDelete(req.params.id).lean();
    if (!lead) throw notFound('Lead not found.');
    sendOk(res, { deleted: true });
  })
);

/* ------------------------------------------------------------------ */
/* Dashboard statistics                                                */
/* ------------------------------------------------------------------ */

adminRouter.get(
  '/stats',
  asyncRoute(async (_req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      servicesTotal,
      servicesPublished,
      servicesFeatured,
      categories,
      testimonialsTotal,
      testimonialsPublished,
      faqsTotal,
      faqsPublished,
      trustPillars,
      leadsTotal,
      leadsNew,
      leadsRecent,
      recentServices,
      recentLeads,
    ] = await Promise.all([
      Service.countDocuments({}),
      Service.countDocuments({ published: true }),
      Service.countDocuments({ featured: true }),
      Category.countDocuments({}),
      Testimonial.countDocuments({}),
      Testimonial.countDocuments({ published: true }),
      Faq.countDocuments({}),
      Faq.countDocuments({ published: true }),
      TrustPillar.countDocuments({}),
      Lead.countDocuments({}),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Service.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('slug title published createdAt imageUrl categoryKey')
        .lean(),
      Lead.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName serviceNeeded status createdAt phone')
        .lean(),
    ]);

    sendOk(res, {
      services: {
        total: servicesTotal,
        published: servicesPublished,
        draft: servicesTotal - servicesPublished,
        featured: servicesFeatured,
      },
      categories,
      testimonials: { total: testimonialsTotal, published: testimonialsPublished },
      faqs: { total: faqsTotal, published: faqsPublished },
      trustPillars,
      leads: { total: leadsTotal, new: leadsNew, last7Days: leadsRecent },
      recentServices: JSON.parse(JSON.stringify(recentServices)),
      recentLeads: JSON.parse(JSON.stringify(recentLeads)),
    });
  })
);
