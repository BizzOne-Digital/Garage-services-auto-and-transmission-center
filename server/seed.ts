/**
 * Seeds MongoDB with the content that currently ships hardcoded in
 * src/i18n and src/lib/constants.ts, so the public site looks identical
 * the moment it starts reading from the database.
 *
 *   npm run seed            -> insert anything that is missing (safe to re-run)
 *   npm run seed -- --force -> also overwrite existing documents
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { hashPassword } from './auth.ts';
import { connectToDatabase, disconnectFromDatabase } from './db.ts';
import { env } from './env.ts';
import { AdminUser } from './models/AdminUser.ts';
import { Category } from './models/Category.ts';
import { Faq } from './models/Faq.ts';
import { Service } from './models/Service.ts';
import { Setting, SETTINGS_KEY } from './models/Setting.ts';
import { Testimonial } from './models/Testimonial.ts';
import { TrustPillar } from './models/TrustPillar.ts';
import { en } from '../src/i18n/en.ts';
import { fr } from '../src/i18n/fr.ts';
import {
  BUSINESS_INFO,
  SERVICE_META,
  TESTIMONIAL_META,
  TRUST_PILLAR_META,
} from '../src/lib/constants.ts';

/** Images currently hardcoded in the Hero and About sections. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1613214149922-f1809c99b414?q=80&w=2070&auto=format&fit=crop';
const ABOUT_IMAGE =
  'https://www.garageuae.com/wp-content/uploads/2022/02/car-transmission-service.jpg';

const loc = (frValue: string | undefined, enValue: string | undefined) => ({
  fr: frValue ?? '',
  en: enValue ?? '',
});

const locList = (frValue: string[] | undefined, enValue: string[] | undefined) => ({
  fr: frValue ?? [],
  en: enValue ?? [],
});

/** Creates the bootstrap admin account from ADMIN_EMAIL / ADMIN_PASSWORD. */
export const ensureAdminUser = async (): Promise<void> => {
  const email = env.adminEmail;
  const existing = await AdminUser.findOne({ email });
  if (existing) return;
  await AdminUser.create({
    email,
    name: env.adminName,
    passwordHash: hashPassword(env.adminPassword),
  });
  console.log(`[seed] created admin account for ${email}`);
};

/**
 * Same as ensureAdminUser, but runs at most once per process and never throws.
 * Serverless platforms have no boot step, so the bootstrap account is created
 * on the first API request of a cold start instead.
 */
let adminBootstrap: Promise<void> | null = null;

export const ensureAdminUserOnce = async (): Promise<void> => {
  if (!adminBootstrap) {
    adminBootstrap = ensureAdminUser().catch(error => {
      // Retry on a later request instead of caching the failure forever.
      adminBootstrap = null;
      console.error('[seed] admin bootstrap failed:', (error as Error).message);
    });
  }
  return adminBootstrap;
};

const upsert = async (
  model: { findOne: Function; create: Function; updateOne: Function },
  query: Record<string, unknown>,
  doc: Record<string, unknown>,
  force: boolean
): Promise<'created' | 'updated' | 'skipped'> => {
  const existing = await model.findOne(query).lean();
  if (!existing) {
    await model.create(doc);
    return 'created';
  }
  if (force) {
    await model.updateOne(query, { $set: doc });
    return 'updated';
  }
  return 'skipped';
};

const seedCategories = async (force: boolean) => {
  const keys = ['transmission', 'mechanical', 'maintenance'] as const;
  for (const [index, key] of keys.entries()) {
    await upsert(
      Category,
      { key },
      { key, label: loc(fr.services.filters[key], en.services.filters[key]), order: index, published: true },
      force
    );
  }
  console.log(`[seed] categories: ${keys.length}`);
};

const seedServices = async (force: boolean) => {
  for (const [index, meta] of SERVICE_META.entries()) {
    const frCopy = fr.services.items[meta.id as keyof typeof fr.services.items];
    const enCopy = en.services.items[meta.id as keyof typeof en.services.items];

    await upsert(
      Service,
      { slug: meta.id },
      {
        slug: meta.id,
        categoryKey: meta.category,
        iconName: meta.iconName,
        imageUrl: '',
        videoUrl: '',
        featured: meta.category === 'transmission',
        published: true,
        order: index,
        title: loc(frCopy.title, enCopy.title),
        shortDesc: loc(frCopy.shortDesc, enCopy.shortDesc),
        fullDesc: loc(frCopy.fullDesc, enCopy.fullDesc),
        features: locList(frCopy.features, enCopy.features),
        commonSymptoms: locList(
          (frCopy as { commonSymptoms?: string[] }).commonSymptoms,
          (enCopy as { commonSymptoms?: string[] }).commonSymptoms
        ),
        turnaroundTime: loc(
          (frCopy as { turnaroundTime?: string }).turnaroundTime,
          (enCopy as { turnaroundTime?: string }).turnaroundTime
        ),
        idealFor: loc(frCopy.idealFor, enCopy.idealFor),
      },
      force
    );
  }
  console.log(`[seed] services: ${SERVICE_META.length}`);
};

const seedTrustPillars = async (force: boolean) => {
  for (const [index, meta] of TRUST_PILLAR_META.entries()) {
    const frCopy = fr.trustBar.pillars[meta.key];
    const enCopy = en.trustBar.pillars[meta.key];
    await upsert(
      TrustPillar,
      { key: meta.key },
      {
        key: meta.key,
        iconName: meta.iconName,
        title: loc(frCopy.title, enCopy.title),
        subtitle: loc(frCopy.subtitle, enCopy.subtitle),
        description: loc(frCopy.description, enCopy.description),
        published: true,
        order: index,
      },
      force
    );
  }
  console.log(`[seed] trust pillars: ${TRUST_PILLAR_META.length}`);
};

const seedTestimonials = async (force: boolean) => {
  for (const [index, frItem] of fr.testimonials.items.entries()) {
    const enItem = en.testimonials.items.find(item => item.id === frItem.id) ?? frItem;
    const flags = TESTIMONIAL_META[frItem.id] ?? { rating: 5, verified: true };
    await upsert(
      Testimonial,
      { key: frItem.id },
      {
        key: frItem.id,
        name: frItem.name,
        role: loc(frItem.role, enItem.role),
        vehicle: loc(frItem.vehicle, enItem.vehicle),
        serviceCategory: loc(frItem.serviceCategory, enItem.serviceCategory),
        content: loc(frItem.content, enItem.content),
        date: loc(frItem.date, enItem.date),
        rating: flags.rating,
        verified: flags.verified,
        published: true,
        order: index,
      },
      force
    );
  }
  console.log(`[seed] testimonials: ${fr.testimonials.items.length}`);
};

const seedFaqs = async (force: boolean) => {
  for (const [index, frFaq] of fr.pricing.faqs.entries()) {
    const enFaq = en.pricing.faqs[index] ?? frFaq;
    await upsert(
      Faq,
      { 'question.fr': frFaq.q },
      {
        question: loc(frFaq.q, enFaq.q),
        answer: loc(frFaq.a, enFaq.a),
        published: true,
        order: index,
      },
      force
    );
  }
  console.log(`[seed] faqs: ${fr.pricing.faqs.length}`);
};

const seedSettings = async (force: boolean) => {
  const doc = {
    singleton: SETTINGS_KEY,
    shortName: BUSINESS_INFO.shortName,
    businessName: loc(fr.common.businessName, en.common.businessName),
    contactPerson: BUSINESS_INFO.contactPerson,
    phone: BUSINESS_INFO.phone,
    phoneRaw: BUSINESS_INFO.phoneRaw,
    email: BUSINESS_INFO.email,
    socialMediaName: BUSINESS_INFO.socialMediaName,
    socialLinks: [],
    logoUrl: BUSINESS_INFO.logoUrl,
    heroImageUrl: HERO_IMAGE,
    aboutImageUrl: ABOUT_IMAGE,
  };
  const result = await upsert(Setting, { singleton: SETTINGS_KEY }, doc, force);
  console.log(`[seed] settings: ${result}`);
};

export const runSeed = async (force: boolean): Promise<void> => {
  await connectToDatabase();
  await ensureAdminUser();
  await seedCategories(force);
  await seedServices(force);
  await seedTrustPillars(force);
  await seedTestimonials(force);
  await seedFaqs(force);
  await seedSettings(force);
};

const isEntryPoint =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isEntryPoint) {
  const force = process.argv.includes('--force');
  runSeed(force)
    .then(async () => {
      console.log(force ? '[seed] done (existing documents overwritten)' : '[seed] done');
      await disconnectFromDatabase();
      process.exit(0);
    })
    .catch(async error => {
      console.error('[seed] failed:', (error as Error).message);
      await disconnectFromDatabase().catch(() => {});
      process.exit(1);
    });
}
