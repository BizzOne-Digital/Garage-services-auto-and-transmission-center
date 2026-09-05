// GENERATED FILE — do not edit. Run `npm run build:api` after changing server/.
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/env.ts
import "dotenv/config";
var required, optional, env;
var init_env = __esm({
  "server/env.ts"() {
    required = (name, value) => {
      if (!value || !value.trim()) {
        throw new Error(
          `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`
        );
      }
      return value.trim();
    };
    optional = (value, fallback = "") => (value ?? fallback).trim();
    env = {
      nodeEnv: optional(process.env.NODE_ENV, "development"),
      get isProduction() {
        return this.nodeEnv === "production";
      },
      port: Number(optional(process.env.PORT, "4000")),
      /** Never hardcoded — always read from the environment. */
      get mongodbUri() {
        return required("MONGODB_URI", process.env.MONGODB_URI);
      },
      mongodbDbName: optional(process.env.MONGODB_DB_NAME),
      /** Seed / bootstrap credentials for the first admin account. */
      get adminEmail() {
        return required("ADMIN_EMAIL", process.env.ADMIN_EMAIL).toLowerCase();
      },
      get adminPassword() {
        return required("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD);
      },
      adminName: optional(process.env.ADMIN_NAME, "Administrator"),
      /** Secret used to sign the admin session cookie. */
      get authSecret() {
        return required("AUTH_SECRET", process.env.AUTH_SECRET);
      },
      sessionTtlDays: Number(optional(process.env.SESSION_TTL_DAYS, "7")),
      siteUrl: optional(process.env.SITE_URL, "http://localhost:3000")
    };
  }
});

// server/http.ts
var HttpError, badRequest, unauthorized, notFound, conflict, sendOk, asyncRoute, MAX_TEXT, cleanText, cleanBool, cleanNumber, cleanLocalized, cleanLocalizedList, cleanUrl, slugify, isEmail, REGEX_SPECIAL_CHARS, escapeRegex;
var init_http = __esm({
  "server/http.ts"() {
    HttpError = class extends Error {
      constructor(status, message, fields) {
        super(message);
        this.status = status;
        this.fields = fields;
      }
    };
    badRequest = (message, fields) => new HttpError(400, message, fields);
    unauthorized = (message = "Authentication required.") => new HttpError(401, message);
    notFound = (message = "Record not found.") => new HttpError(404, message);
    conflict = (message, fields) => new HttpError(409, message, fields);
    sendOk = (res, data, status = 200) => {
      res.status(status).json({ ok: true, data });
    };
    asyncRoute = (handler) => (req, res, next) => {
      handler(req, res, next).catch(next);
    };
    MAX_TEXT = 5e3;
    cleanText = (value, maxLength = MAX_TEXT) => {
      if (typeof value !== "string") return "";
      return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
    };
    cleanBool = (value, fallback = false) => {
      if (typeof value === "boolean") return value;
      if (value === "true") return true;
      if (value === "false") return false;
      return fallback;
    };
    cleanNumber = (value, fallback = 0) => {
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    cleanLocalized = (value, maxLength = MAX_TEXT) => {
      const source = value ?? {};
      return { fr: cleanText(source.fr, maxLength), en: cleanText(source.en, maxLength) };
    };
    cleanLocalizedList = (value, maxItems = 24) => {
      const source = value ?? {};
      const list = (input) => Array.isArray(input) ? input.map((entry) => cleanText(entry, 400)).filter(Boolean).slice(0, maxItems) : [];
      return { fr: list(source.fr), en: list(source.en) };
    };
    cleanUrl = (value) => {
      const raw = cleanText(value, 2e3);
      if (!raw) return "";
      if (/^https?:\/\//i.test(raw)) return raw;
      if (/^data:(image|video)\//i.test(raw)) return raw;
      if (raw.startsWith("/")) return raw;
      throw badRequest("URLs must start with http://, https:// or /.");
    };
    slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
    isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    REGEX_SPECIAL_CHARS = /* @__PURE__ */ new Set([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]);
    escapeRegex = (value) => Array.from(value).map((char) => REGEX_SPECIAL_CHARS.has(char) ? `\\${char}` : char).join("");
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  SESSION_COOKIE: () => SESSION_COOKIE,
  clearLoginAttempts: () => clearLoginAttempts,
  clearSessionCookie: () => clearSessionCookie,
  createSessionToken: () => createSessionToken,
  hashPassword: () => hashPassword,
  isLoginBlocked: () => isLoginBlocked,
  readAdminSession: () => readAdminSession,
  readSessionToken: () => readSessionToken,
  registerFailedLogin: () => registerFailedLogin,
  requireAdmin: () => requireAdmin,
  setSessionCookie: () => setSessionCookie,
  verifyPassword: () => verifyPassword
});
import crypto from "node:crypto";
var SESSION_COOKIE, SCRYPT_KEYLEN, hashPassword, verifyPassword, b64url, sign, createSessionToken, readSessionToken, parseCookies, setSessionCookie, clearSessionCookie, requireAdmin, readAdminSession, attempts, WINDOW_MS, MAX_ATTEMPTS, registerFailedLogin, isLoginBlocked, clearLoginAttempts;
var init_auth = __esm({
  "server/auth.ts"() {
    init_env();
    init_http();
    SESSION_COOKIE = "gsa_admin_session";
    SCRYPT_KEYLEN = 64;
    hashPassword = (password) => {
      const salt = crypto.randomBytes(16);
      const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
      return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
    };
    verifyPassword = (password, stored) => {
      const [scheme, saltHex, hashHex] = (stored || "").split("$");
      if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
      const expected = Buffer.from(hashHex, "hex");
      let derived;
      try {
        derived = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
      } catch {
        return false;
      }
      return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
    };
    b64url = (input) => Buffer.from(input).toString("base64url");
    sign = (value) => crypto.createHmac("sha256", env.authSecret).update(value).digest("base64url");
    createSessionToken = (payload) => {
      const exp = Date.now() + env.sessionTtlDays * 24 * 60 * 60 * 1e3;
      const body = b64url(JSON.stringify({ ...payload, exp }));
      return `${body}.${sign(body)}`;
    };
    readSessionToken = (token) => {
      if (!token) return null;
      const [body, signature] = token.split(".");
      if (!body || !signature) return null;
      const expected = sign(body);
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
      try {
        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        if (!payload?.sub || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
        return payload;
      } catch {
        return null;
      }
    };
    parseCookies = (header) => {
      const jar = {};
      if (!header) return jar;
      for (const part of header.split(";")) {
        const index = part.indexOf("=");
        if (index < 0) continue;
        const key = part.slice(0, index).trim();
        if (key) jar[key] = decodeURIComponent(part.slice(index + 1).trim());
      }
      return jar;
    };
    setSessionCookie = (res, token) => {
      res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.isProduction,
        path: "/",
        maxAge: env.sessionTtlDays * 24 * 60 * 60 * 1e3
      });
    };
    clearSessionCookie = (res) => {
      res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.isProduction,
        path: "/"
      });
    };
    requireAdmin = (req, _res, next) => {
      const cookies = parseCookies(req.headers.cookie);
      const session = readSessionToken(cookies[SESSION_COOKIE]);
      if (!session) {
        next(unauthorized());
        return;
      }
      req.admin = session;
      next();
    };
    readAdminSession = (req) => readSessionToken(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
    attempts = /* @__PURE__ */ new Map();
    WINDOW_MS = 15 * 60 * 1e3;
    MAX_ATTEMPTS = 8;
    registerFailedLogin = (key) => {
      const entry = attempts.get(key);
      if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
        attempts.set(key, { count: 1, firstAt: Date.now() });
        return;
      }
      entry.count += 1;
    };
    isLoginBlocked = (key) => {
      const entry = attempts.get(key);
      if (!entry) return false;
      if (Date.now() - entry.firstAt > WINDOW_MS) {
        attempts.delete(key);
        return false;
      }
      return entry.count >= MAX_ATTEMPTS;
    };
    clearLoginAttempts = (key) => {
      attempts.delete(key);
    };
  }
});

// server/index.ts
import path2 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import express from "express";

// server/db.ts
init_env();
import mongoose from "mongoose";
var connectionPromise = null;
mongoose.set("strictQuery", true);
var connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri, {
      dbName: env.mongodbDbName || void 0,
      serverSelectionTimeoutMS: 1e4,
      maxPoolSize: 10
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
};
var isDatabaseReady = () => mongoose.connection.readyState === 1;
var disconnectFromDatabase = async () => {
  connectionPromise = null;
  await mongoose.disconnect();
};

// server/index.ts
init_env();
init_http();

// server/routes/admin.ts
init_auth();
init_http();
import { Router as Router3 } from "express";
import mongoose10 from "mongoose";

// server/models/Category.ts
import mongoose2, { Schema as Schema2 } from "mongoose";

// server/models/shared.ts
import { Schema } from "mongoose";
var localizedSchema = new Schema(
  {
    fr: { type: String, default: "", trim: true },
    en: { type: String, default: "", trim: true }
  },
  { _id: false }
);
var localizedListSchema = new Schema(
  {
    fr: { type: [String], default: [] },
    en: { type: [String], default: [] }
  },
  { _id: false }
);
var baseOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: false,
    transform: (_doc, ret) => {
      ret._id = String(ret._id);
      return ret;
    }
  }
};

// server/models/Category.ts
var categorySchema = new Schema2(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  baseOptions
);
categorySchema.index({ order: 1 });
var Category = mongoose2.models.Category || mongoose2.model("Category", categorySchema);

// server/models/Faq.ts
import mongoose3, { Schema as Schema3 } from "mongoose";
var faqSchema = new Schema3(
  {
    question: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    answer: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);
faqSchema.index({ published: 1, order: 1 });
var Faq = mongoose3.models.Faq || mongoose3.model("Faq", faqSchema);

// server/models/Lead.ts
import mongoose4, { Schema as Schema4 } from "mongoose";
var leadSchema = new Schema4(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    vehicleMakeModel: { type: String, default: "", trim: true },
    vehicleYear: { type: String, default: "", trim: true },
    serviceNeeded: { type: String, default: "", trim: true },
    transmissionType: { type: String, default: "", trim: true },
    urgency: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    source: { type: String, enum: ["contact-form", "quote-modal"], default: "contact-form" },
    language: { type: String, enum: ["fr", "en"], default: "fr" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "lost"],
      default: "new"
    },
    notes: { type: String, default: "", trim: true }
  },
  baseOptions
);
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });
var Lead = mongoose4.models.Lead || mongoose4.model("Lead", leadSchema);

// server/models/Service.ts
import mongoose5, { Schema as Schema5 } from "mongoose";
var serviceSchema = new Schema5(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    categoryKey: { type: String, required: true, trim: true, lowercase: true },
    iconName: { type: String, default: "Wrench", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    videoUrl: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    title: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    shortDesc: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    fullDesc: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    features: { type: localizedListSchema, default: () => ({ fr: [], en: [] }) },
    commonSymptoms: { type: localizedListSchema, default: () => ({ fr: [], en: [] }) },
    turnaroundTime: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    idealFor: { type: localizedSchema, default: () => ({ fr: "", en: "" }) }
  },
  baseOptions
);
serviceSchema.index({ published: 1, order: 1 });
serviceSchema.index({ categoryKey: 1 });
serviceSchema.index({ "title.fr": "text", "title.en": "text", slug: "text" });
var Service = mongoose5.models.Service || mongoose5.model("Service", serviceSchema);

// server/models/Setting.ts
import mongoose6, { Schema as Schema6 } from "mongoose";
var settingSchema = new Schema6(
  {
    singleton: { type: String, default: "site", unique: true, immutable: true },
    shortName: { type: String, default: "", trim: true },
    businessName: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    contactPerson: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    phoneRaw: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    socialMediaName: { type: String, default: "", trim: true },
    socialLinks: {
      type: [{ _id: false, label: String, url: String }],
      default: []
    },
    logoUrl: { type: String, default: "", trim: true },
    heroImageUrl: { type: String, default: "", trim: true },
    aboutImageUrl: { type: String, default: "", trim: true }
  },
  baseOptions
);
var Setting = mongoose6.models.Setting || mongoose6.model("Setting", settingSchema);
var SETTINGS_KEY = "site";

// server/models/Testimonial.ts
import mongoose7, { Schema as Schema7 } from "mongoose";
var testimonialSchema = new Schema7(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    vehicle: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    serviceCategory: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    content: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    date: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    verified: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);
testimonialSchema.index({ published: 1, order: 1 });
var Testimonial = mongoose7.models.Testimonial || mongoose7.model("Testimonial", testimonialSchema);

// server/models/TrustPillar.ts
import mongoose8, { Schema as Schema8 } from "mongoose";
var trustPillarSchema = new Schema8(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    iconName: { type: String, default: "ShieldCheck", trim: true },
    title: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    subtitle: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    description: { type: localizedSchema, default: () => ({ fr: "", en: "" }) },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  baseOptions
);
trustPillarSchema.index({ published: 1, order: 1 });
var TrustPillar = mongoose8.models.TrustPillar || mongoose8.model("TrustPillar", trustPillarSchema);

// server/routes/crud.ts
init_http();
import { Router as Router2 } from "express";
import mongoose9 from "mongoose";

// server/routes/public.ts
import { Router } from "express";
init_http();
var publicRouter = Router();
var CACHE_TTL_MS = 6e4;
var cache = null;
var invalidatePublicContentCache = () => {
  cache = null;
};
var loadPublicContent = async () => {
  if (cache && cache.expiresAt > Date.now()) return cache.payload;
  const [settings, categories, services, testimonials, faqs, trustPillars] = await Promise.all([
    Setting.findOne({ singleton: SETTINGS_KEY }).lean(),
    Category.find({ published: true }).sort({ order: 1 }).lean(),
    Service.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Testimonial.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    Faq.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean(),
    TrustPillar.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean()
  ]);
  const payload = JSON.parse(
    JSON.stringify({
      settings: settings ?? null,
      categories,
      services,
      testimonials,
      faqs,
      trustPillars,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    })
  );
  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  return payload;
};
publicRouter.get(
  "/content",
  asyncRoute(async (_req, res) => {
    const content = await loadPublicContent();
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    sendOk(res, content);
  })
);
var leadRateLimit = /* @__PURE__ */ new Map();
var LEAD_WINDOW_MS = 10 * 60 * 1e3;
var LEAD_MAX = 10;
var isRateLimited = (ip) => {
  const entry = leadRateLimit.get(ip);
  if (!entry || Date.now() - entry.firstAt > LEAD_WINDOW_MS) {
    leadRateLimit.set(ip, { count: 1, firstAt: Date.now() });
    return false;
  }
  entry.count += 1;
  return entry.count > LEAD_MAX;
};
publicRouter.post(
  "/leads",
  asyncRoute(async (req, res) => {
    const ip = req.ip || "unknown";
    if (isRateLimited(ip)) {
      throw badRequest("Too many requests. Please call us directly or try again shortly.");
    }
    const body = req.body ?? {};
    const fullName = cleanText(body.fullName, 120);
    const phone = cleanText(body.phone, 40);
    const email = cleanText(body.email, 160).toLowerCase();
    const vehicleMakeModel = cleanText(body.vehicleMakeModel, 120);
    const fields = {};
    if (!fullName) fields.fullName = "Full name is required.";
    if (!phone || phone.replace(/\D/g, "").length < 10) fields.phone = "A valid phone number is required.";
    if (!email || !isEmail(email)) fields.email = "A valid email address is required.";
    if (Object.keys(fields).length) throw badRequest("Please review the highlighted fields.", fields);
    const source = body.source === "quote-modal" ? "quote-modal" : "contact-form";
    const language = body.language === "en" ? "en" : "fr";
    const lead = await Lead.create({
      fullName,
      phone,
      email,
      vehicleMakeModel,
      vehicleYear: cleanText(body.vehicleYear, 12),
      serviceNeeded: cleanText(body.serviceNeeded, 80),
      transmissionType: cleanText(body.transmissionType, 60),
      urgency: cleanText(body.urgency, 40),
      message: cleanText(body.message, 4e3),
      source,
      language
    });
    sendOk(res, { id: String(lead._id), received: true }, 201);
  })
);

// server/routes/crud.ts
var DUPLICATE_KEY = 11e3;
var describeDuplicate = (error, label) => {
  const key = Object.keys(error?.keyPattern ?? {})[0];
  const field = key ?? "value";
  return conflict(`Another ${label.toLowerCase()} already uses this ${field}.`, {
    [field]: "Already in use."
  });
};
var isDuplicate = (error) => error?.code === DUPLICATE_KEY;
var createCrudRouter = (options) => {
  const router = Router2();
  const { model, sanitize, searchFields, defaultSort, filterFields = [], label } = options;
  router.get(
    "/",
    asyncRoute(async (req, res) => {
      const page = Math.max(1, cleanNumber(req.query.page, 1));
      const pageSize = Math.min(100, Math.max(1, cleanNumber(req.query.pageSize, 20)));
      const search = cleanText(req.query.search, 120);
      const filter = {};
      for (const field of filterFields) {
        const value = cleanText(req.query[field], 80);
        if (!value || value === "all") continue;
        if (value === "true" || value === "false") filter[field] = value === "true";
        else filter[field] = value;
      }
      if (search) {
        const pattern = new RegExp(escapeRegex(search), "i");
        filter.$or = searchFields.map((field) => ({ [field]: pattern }));
      }
      const [items, total] = await Promise.all([
        model.find(filter).sort(defaultSort).skip((page - 1) * pageSize).limit(pageSize).lean(),
        model.countDocuments(filter)
      ]);
      sendOk(res, {
        items: JSON.parse(JSON.stringify(items)),
        total,
        page,
        pageSize,
        pages: Math.max(1, Math.ceil(total / pageSize))
      });
    })
  );
  router.get(
    "/:id",
    asyncRoute(async (req, res) => {
      if (!mongoose9.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const doc = await model.findById(req.params.id).lean();
      if (!doc) throw notFound(`${label} not found.`);
      sendOk(res, JSON.parse(JSON.stringify(doc)));
    })
  );
  router.post(
    "/",
    asyncRoute(async (req, res) => {
      const payload = sanitize(req.body ?? {}, true);
      try {
        const doc = await model.create(payload);
        invalidatePublicContentCache();
        sendOk(res, JSON.parse(JSON.stringify(doc.toJSON())), 201);
      } catch (error) {
        if (isDuplicate(error)) throw describeDuplicate(error, label);
        throw error;
      }
    })
  );
  router.patch(
    "/:id",
    asyncRoute(async (req, res) => {
      if (!mongoose9.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const payload = sanitize(req.body ?? {}, false);
      try {
        const doc = await model.findByIdAndUpdate(req.params.id, payload, { returnDocument: "after", runValidators: true }).lean();
        if (!doc) throw notFound(`${label} not found.`);
        invalidatePublicContentCache();
        sendOk(res, JSON.parse(JSON.stringify(doc)));
      } catch (error) {
        if (isDuplicate(error)) throw describeDuplicate(error, label);
        throw error;
      }
    })
  );
  router.delete(
    "/:id",
    asyncRoute(async (req, res) => {
      if (!mongoose9.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const doc = await model.findByIdAndDelete(req.params.id).lean();
      if (!doc) throw notFound(`${label} not found.`);
      invalidatePublicContentCache();
      sendOk(res, { deleted: true, _id: String(doc._id) });
    })
  );
  return router;
};

// server/routes/admin.ts
var adminRouter = Router3();
adminRouter.use(requireAdmin);
adminRouter.use(
  "/services",
  createCrudRouter({
    model: Service,
    label: "Service",
    searchFields: ["slug", "title.fr", "title.en"],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ["categoryKey", "published", "featured"],
    sanitize: (body, isCreate) => {
      const title = cleanLocalized(body.title, 160);
      const slug = slugify(cleanText(body.slug, 90) || title.en || title.fr);
      if (isCreate && !slug) {
        throw badRequest("A slug (or title) is required.", { slug: "Required." });
      }
      const doc = {
        categoryKey: slugify(cleanText(body.categoryKey, 60)) || "mechanical",
        iconName: cleanText(body.iconName, 40) || "Wrench",
        imageUrl: cleanUrl(body.imageUrl),
        videoUrl: cleanUrl(body.videoUrl),
        featured: cleanBool(body.featured),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0),
        title,
        shortDesc: cleanLocalized(body.shortDesc, 400),
        fullDesc: cleanLocalized(body.fullDesc, 4e3),
        features: cleanLocalizedList(body.features),
        commonSymptoms: cleanLocalizedList(body.commonSymptoms),
        turnaroundTime: cleanLocalized(body.turnaroundTime, 200),
        idealFor: cleanLocalized(body.idealFor, 400)
      };
      if (slug) doc.slug = slug;
      return doc;
    }
  })
);
adminRouter.use(
  "/categories",
  createCrudRouter({
    model: Category,
    label: "Category",
    searchFields: ["key", "label.fr", "label.en"],
    defaultSort: { order: 1 },
    filterFields: ["published"],
    sanitize: (body, isCreate) => {
      const label = cleanLocalized(body.label, 120);
      const key = slugify(cleanText(body.key, 60) || label.en || label.fr);
      if (isCreate && !key) throw badRequest("A category key is required.", { key: "Required." });
      const doc = {
        label,
        order: cleanNumber(body.order, 0),
        published: cleanBool(body.published, true)
      };
      if (key) doc.key = key;
      return doc;
    }
  })
);
adminRouter.use(
  "/testimonials",
  createCrudRouter({
    model: Testimonial,
    label: "Testimonial",
    searchFields: ["name", "content.fr", "content.en"],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ["published"],
    sanitize: (body, isCreate) => {
      const name = cleanText(body.name, 120);
      if (isCreate && !name) throw badRequest("A customer name is required.", { name: "Required." });
      const doc = {
        role: cleanLocalized(body.role, 120),
        vehicle: cleanLocalized(body.vehicle, 120),
        serviceCategory: cleanLocalized(body.serviceCategory, 160),
        content: cleanLocalized(body.content, 2e3),
        date: cleanLocalized(body.date, 80),
        rating: Math.min(5, Math.max(1, Math.round(cleanNumber(body.rating, 5)))),
        verified: cleanBool(body.verified, true),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0)
      };
      if (name) doc.name = name;
      if (isCreate) {
        doc.key = slugify(cleanText(body.key, 60) || name) || `t-${Date.now().toString(36)}`;
      }
      return doc;
    }
  })
);
adminRouter.use(
  "/faqs",
  createCrudRouter({
    model: Faq,
    label: "FAQ",
    searchFields: ["question.fr", "question.en"],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ["published"],
    sanitize: (body) => ({
      question: cleanLocalized(body.question, 400),
      answer: cleanLocalized(body.answer, 4e3),
      published: cleanBool(body.published, true),
      order: cleanNumber(body.order, 0)
    })
  })
);
adminRouter.use(
  "/trust-pillars",
  createCrudRouter({
    model: TrustPillar,
    label: "Trust pillar",
    searchFields: ["key", "title.fr", "title.en"],
    defaultSort: { order: 1, createdAt: 1 },
    filterFields: ["published"],
    sanitize: (body, isCreate) => {
      const title = cleanLocalized(body.title, 160);
      const key = slugify(cleanText(body.key, 60) || title.en || title.fr);
      if (isCreate && !key) throw badRequest("A key is required.", { key: "Required." });
      const doc = {
        iconName: cleanText(body.iconName, 40) || "ShieldCheck",
        title,
        subtitle: cleanLocalized(body.subtitle, 200),
        description: cleanLocalized(body.description, 600),
        published: cleanBool(body.published, true),
        order: cleanNumber(body.order, 0)
      };
      if (key) doc.key = key;
      return doc;
    }
  })
);
adminRouter.get(
  "/settings",
  asyncRoute(async (_req, res) => {
    const settings = await Setting.findOne({ singleton: SETTINGS_KEY }).lean();
    sendOk(res, settings ? JSON.parse(JSON.stringify(settings)) : null);
  })
);
adminRouter.put(
  "/settings",
  asyncRoute(async (req, res) => {
    const body = req.body ?? {};
    const rawLinks = Array.isArray(body.socialLinks) ? body.socialLinks : [];
    const update = {
      shortName: cleanText(body.shortName, 120),
      businessName: cleanLocalized(body.businessName, 200),
      contactPerson: cleanText(body.contactPerson, 120),
      phone: cleanText(body.phone, 40),
      phoneRaw: cleanText(body.phoneRaw, 20).replace(/\D/g, ""),
      email: cleanText(body.email, 160).toLowerCase(),
      socialMediaName: cleanText(body.socialMediaName, 160),
      socialLinks: rawLinks.slice(0, 12).map((entry) => {
        const link = entry ?? {};
        return { label: cleanText(link.label, 60), url: cleanUrl(link.url) };
      }).filter((link) => link.label && link.url),
      logoUrl: cleanUrl(body.logoUrl),
      heroImageUrl: cleanUrl(body.heroImageUrl),
      aboutImageUrl: cleanUrl(body.aboutImageUrl)
    };
    const settings = await Setting.findOneAndUpdate(
      { singleton: SETTINGS_KEY },
      { $set: update, $setOnInsert: { singleton: SETTINGS_KEY } },
      { returnDocument: "after", upsert: true, runValidators: true }
    ).lean();
    invalidatePublicContentCache();
    sendOk(res, JSON.parse(JSON.stringify(settings)));
  })
);
var LEAD_STATUSES = ["new", "contacted", "quoted", "won", "lost"];
adminRouter.get(
  "/leads",
  asyncRoute(async (req, res) => {
    const page = Math.max(1, cleanNumber(req.query.page, 1));
    const pageSize = Math.min(100, Math.max(1, cleanNumber(req.query.pageSize, 20)));
    const search = cleanText(req.query.search, 120);
    const status = cleanText(req.query.status, 20);
    const filter = {};
    if (LEAD_STATUSES.includes(status)) filter.status = status;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { fullName: pattern },
        { email: pattern },
        { phone: pattern },
        { vehicleMakeModel: pattern }
      ];
    }
    const [items, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
      Lead.countDocuments(filter)
    ]);
    sendOk(res, {
      items: JSON.parse(JSON.stringify(items)),
      total,
      page,
      pageSize,
      pages: Math.max(1, Math.ceil(total / pageSize))
    });
  })
);
adminRouter.patch(
  "/leads/:id",
  asyncRoute(async (req, res) => {
    if (!mongoose10.isValidObjectId(req.params.id)) throw notFound("Lead not found.");
    const body = req.body ?? {};
    const status = cleanText(body.status, 20);
    const update = { notes: cleanText(body.notes, 4e3) };
    if (LEAD_STATUSES.includes(status)) update.status = status;
    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { returnDocument: "after" }).lean();
    if (!lead) throw notFound("Lead not found.");
    sendOk(res, JSON.parse(JSON.stringify(lead)));
  })
);
adminRouter.delete(
  "/leads/:id",
  asyncRoute(async (req, res) => {
    if (!mongoose10.isValidObjectId(req.params.id)) throw notFound("Lead not found.");
    const lead = await Lead.findByIdAndDelete(req.params.id).lean();
    if (!lead) throw notFound("Lead not found.");
    sendOk(res, { deleted: true });
  })
);
adminRouter.get(
  "/stats",
  asyncRoute(async (_req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
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
      recentLeads
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
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Service.find({}).sort({ createdAt: -1 }).limit(5).select("slug title published createdAt imageUrl categoryKey").lean(),
      Lead.find({}).sort({ createdAt: -1 }).limit(5).select("fullName serviceNeeded status createdAt phone").lean()
    ]);
    sendOk(res, {
      services: {
        total: servicesTotal,
        published: servicesPublished,
        draft: servicesTotal - servicesPublished,
        featured: servicesFeatured
      },
      categories,
      testimonials: { total: testimonialsTotal, published: testimonialsPublished },
      faqs: { total: faqsTotal, published: faqsPublished },
      trustPillars,
      leads: { total: leadsTotal, new: leadsNew, last7Days: leadsRecent },
      recentServices: JSON.parse(JSON.stringify(recentServices)),
      recentLeads: JSON.parse(JSON.stringify(recentLeads))
    });
  })
);

// server/routes/auth.ts
import { Router as Router4 } from "express";

// server/models/AdminUser.ts
import mongoose11, { Schema as Schema9 } from "mongoose";
var adminUserSchema = new Schema9(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Never selected by default so it cannot leak through a generic query.
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: "Administrator", trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: { type: Date, default: null }
  },
  baseOptions
);
var AdminUser = mongoose11.models.AdminUser || mongoose11.model("AdminUser", adminUserSchema);

// server/routes/auth.ts
init_auth();
init_http();
var authRouter = Router4();
authRouter.post(
  "/login",
  asyncRoute(async (req, res) => {
    const body = req.body ?? {};
    const email = cleanText(body.email, 160).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) {
      throw badRequest("Email and password are required.", {
        ...email ? {} : { email: "Email is required." },
        ...password ? {} : { password: "Password is required." }
      });
    }
    const throttleKey = `${req.ip || "unknown"}:${email}`;
    if (isLoginBlocked(throttleKey)) {
      throw new HttpError(429, "Too many failed attempts. Please wait a few minutes and try again.");
    }
    const user = await AdminUser.findOne({ email }).select("+passwordHash");
    if (!user || !verifyPassword(password, user.passwordHash)) {
      registerFailedLogin(throttleKey);
      throw unauthorized("Invalid email or password.");
    }
    clearLoginAttempts(throttleKey);
    user.lastLoginAt = /* @__PURE__ */ new Date();
    await user.save();
    setSessionCookie(res, createSessionToken({ sub: String(user._id), email: user.email, name: user.name }));
    sendOk(res, { _id: String(user._id), email: user.email, name: user.name, lastLoginAt: null });
  })
);
authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  sendOk(res, { ok: true });
});
authRouter.get(
  "/me",
  asyncRoute(async (req, res) => {
    const session = readAdminSession(req);
    if (!session) throw unauthorized();
    const user = await AdminUser.findById(session.sub).lean();
    if (!user) {
      clearSessionCookie(res);
      throw unauthorized();
    }
    sendOk(res, {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null
    });
  })
);
authRouter.post(
  "/password",
  requireAdmin,
  asyncRoute(async (req, res) => {
    const body = req.body ?? {};
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const nextPassword = typeof body.nextPassword === "string" ? body.nextPassword : "";
    if (nextPassword.length < 10) {
      throw badRequest("Password must be at least 10 characters.", {
        nextPassword: "Use at least 10 characters."
      });
    }
    const user = await AdminUser.findById(req.admin.sub).select("+passwordHash");
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      throw badRequest("Current password is incorrect.", { currentPassword: "Incorrect password." });
    }
    const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
    user.passwordHash = hashPassword2(nextPassword);
    await user.save();
    sendOk(res, { updated: true });
  })
);

// server/seed.ts
init_auth();
import { fileURLToPath } from "node:url";
import path from "node:path";
init_env();

// src/i18n/en.ts
var en = {
  meta: {
    htmlLang: "en",
    title: "Garage Services Auto and Transmission Center | Auto Repair & Transmission Specialist",
    description: "Garage Services Auto and Transmission Center provides professional auto repair and transmission services with dependable workmanship and fair pricing in Montreal. Contact Abdul at (514) 553-4206."
  },
  blog: {
    eyebrow: "Advice & news",
    title: "Blog",
    subtitle: "Maintenance advice, transmission diagnostics and shop news, written by our team.",
    meta: {
      title: "Blog | Garage Services Auto and Transmission Center",
      description: "Auto maintenance advice, transmission diagnostics and news from Garage Services Auto and Transmission Center in Montreal."
    }
  },
  language: {
    label: "Language",
    fr: "FR",
    en: "EN",
    switchToFr: "Switch to French",
    switchToEn: "Switch to English"
  },
  common: {
    businessName: "Garage Services Auto and Transmission Center",
    getQuote: "Get a Quote",
    getFreeQuote: "Get a Free Quote",
    requestFreeQuote: "Request a Free Quote",
    callAbdul: "Call Abdul",
    call: "Call",
    close: "Close",
    details: "Details",
    quote: "Quote",
    location: "Montr\xE9al, QC"
  },
  nav: {
    home: "Home",
    about: "About Us",
    services: "Services",
    pricing: "Pricing",
    testimonials: "Testimonials",
    contact: "Contact",
    ariaMain: "Main Navigation",
    ariaToggleMenu: "Toggle Mobile Menu",
    ariaLogo: "Garage Services Auto and Transmission Center - Return to Top",
    callAbdulWithPhone: "Call Abdul: {phone}"
  },
  loader: {
    status: "Initializing Diagnostic Bay..."
  },
  offline: {
    badge: "Offline",
    title: "No internet connection",
    description: "We cannot reach the network right now. Check your Wi-Fi or mobile data, then try again.",
    retry: "Try again",
    checking: "Checking...",
    callPrompt: "Need to reach us right now? Call us directly:"
  },
  logo: {
    tagline: "Montr\xE9al \u2022 Specialized Precision",
    line2: "AUTO & TRANSMISSION CENTER",
    altEmblem: "Garage Services Auto and Transmission Center Emblem"
  },
  hero: {
    eyebrow: "Montr\xE9al's Transmission & Auto Specialist",
    headlineLine1: "Your Complete",
    headlineAccent: "Auto Repair",
    headlineLine3: "& Transmission",
    subtext: "Professional automotive service you can count on. We provide dependable repairs, expert transmission overhauls, and honest pricing for drivers and partner garages.",
    primaryCta: "Talk to a Specialist",
    directWorkshop: "Direct Workshop",
    locationLabel: "Location",
    imageAlt: "Modern automotive repair workshop and transmission diagnostic bay",
    trust1: "25+ Years Experience",
    trust2: "Fair & Clear Pricing",
    trust3: "Master Tech Diagnostics",
    cards: [
      {
        serviceId: "transmission-services",
        title: "Transmission Overhaul & Rebuild",
        desc: "Specialized precision rebuilds, slipping gear resolution, and torque converter calibration."
      },
      {
        serviceId: "brake-services",
        title: "Brake & Stopping Systems",
        desc: "Precision stopping power maintenance, rotor replacement, and ABS system troubleshooting."
      },
      {
        serviceId: "transmission-diagnostics",
        title: "Computer Engine Diagnostics",
        desc: "State-of-the-art computer scanning to isolate warning lights and performance faults."
      }
    ],
    intakeBanner: "Ready for Immediate Intake"
  },
  trustBar: {
    pillarLabel: "Pillar",
    pillars: {
      professional: {
        title: "Professional Service",
        subtitle: "Expert automotive solutions",
        description: "Certified diagnostic tools and meticulous inspection on every single repair."
      },
      pricing: {
        title: "Fair Pricing",
        subtitle: "Quality service without unnecessary costs",
        description: "Transparent quotes and honest recommendations with zero hidden fees."
      },
      transmission: {
        title: "Transmission Specialists",
        subtitle: "Specialized transmission expertise",
        description: "In-depth rebuilds, fluid service, diagnostics, and repairs for automatic, manual & CVT."
      },
      customer: {
        title: "Customer Focused",
        subtitle: "Service built around your needs",
        description: "Clear explanations, responsive updates, and respectful customer-first care."
      }
    }
  },
  about: {
    eyebrow: "Heritage & Craftsmanship",
    headlineLine1: "Automotive Expertise",
    headlineAccent: "You Can Trust",
    badgeBay: "Transmission Diagnostic Bay",
    leadTechLabel: "Lead Technician",
    leadTechName: "Abdul \u2022 Master Diagnostic Lead",
    imageAlt: "Professional mechanic inspecting engine and transmission system at Garage Services",
    ariaCall: "Call Abdul directly",
    intro: "Garage Services Auto and Transmission Center is dedicated to honest diagnostics, precision transmission rebuilds, and dependable automotive care.",
    paragraph: "We take immense pride in serving both everyday vehicle owners seeking dependable repairs and professional mechanic garages needing trusted, high-precision transmission sub-contracting and diagnostic support.",
    highlights: [
      {
        num: "01",
        title: "Professional Service",
        desc: "Rigorous standards and certified diagnostic equipment on every vehicle."
      },
      {
        num: "02",
        title: "Fair & Clear Pricing",
        desc: "Honest, itemized estimates with no surprise costs or unnecessary upsells."
      },
      {
        num: "03",
        title: "Dependable Workmanship",
        desc: "Repairs performed right the first time with premium quality components."
      },
      {
        num: "04",
        title: "Transmission Expertise",
        desc: "Specialized in-depth transmission rebuilds, diagnostics, and overhauls."
      },
      {
        num: "05",
        title: "Customer-First Approach",
        desc: "Transparent communication with direct, approachable consultation from Abdul."
      }
    ]
  },
  services: {
    eyebrow: "Precision Diagnostic Bay",
    headlineLine1: "Specialized",
    headlineAccent: "Automotive Services",
    intro: "From complete master transmission rebuilds to precision brake repairs and computer diagnostics.",
    filters: {
      all: "All Services",
      transmission: "Transmission",
      mechanical: "Mechanical",
      maintenance: "Maintenance"
    },
    specialtyBadge: "Specialty",
    getQuote: "Get Quote",
    ariaQuoteFor: "Get quote for {service}",
    modal: {
      overview: "Service Overview",
      scope: "Scope of Work & Capabilities",
      symptomsTitle: "Common Symptoms Indicating This Service:",
      idealFor: "Ideal For:",
      ariaClose: "Close modal",
      cta: "Book / Request Quote For This"
    },
    items: {
      "auto-repair": {
        title: "Auto Repair",
        shortDesc: "Professional automotive repairs to keep your vehicle running reliably and smoothly.",
        fullDesc: "Complete bumper-to-bumper mechanical repair services. From electrical troubleshooting and suspension repairs to exhaust systems and cooling systems, we pinpoint the root cause and deliver lasting repairs.",
        features: [
          "Comprehensive vehicle safety inspection",
          "Suspension & steering system repairs",
          "Alternator, battery & starter diagnostics",
          "Cooling system, radiator & water pump service",
          "Exhaust & emission repair"
        ],
        turnaroundTime: "Same-day or next-day turnaround",
        idealFor: "All makes and models needing mechanical or electrical repair"
      },
      "transmission-services": {
        title: "Transmission Services",
        shortDesc: "Specialized transmission inspection, repair, rebuild, and complete maintenance service.",
        fullDesc: "Our flagship specialty. We handle complex transmission maintenance, fluid flushes, solenoid replacements, clutch replacements, and complete rebuilds with precision engineering.",
        features: [
          "Automatic, Manual, CVT & Dual-Clutch expertise",
          "Full transmission fluid flush & filter replacement",
          "Transmission rebuilds & gear replacements",
          "Torque converter & valve body repair",
          "B2B service for partner mechanic garages"
        ],
        turnaroundTime: "Fast turnaround with detailed testing",
        commonSymptoms: ["Slipping gears", "Rough shifting", "Delayed engagement", "Fluid leaks"],
        idealFor: "Drivers and mechanic shops requiring specialized transmission care"
      },
      "transmission-diagnostics": {
        title: "Transmission Diagnostics",
        shortDesc: "Identify transmission problems accurately before they become bigger, costlier issues.",
        fullDesc: "Advanced computer diagnostics coupled with electronic sensor scanning and hydraulic road testing to accurately isolate transmission faults without guesswork.",
        features: [
          "Computerized error code reading & live data stream",
          "Electronic solenoid & sensor testing",
          "Hydraulic pressure test & road testing",
          "Transmission fluid condition & contamination analysis",
          "Itemized diagnostic report before any repair"
        ],
        turnaroundTime: "Rapid inspection available",
        commonSymptoms: [
          "Check Engine / Transmission light on",
          "Strange RPM spikes",
          "Jerking during gear shifts"
        ],
        idealFor: "Vehicles with intermittent shifting issues or transmission warning lights"
      },
      "brake-services": {
        title: "Brake Services",
        shortDesc: "Professional brake inspection, maintenance, rotor resurfacing, and complete repair.",
        fullDesc: "Ensure maximum stopping power and safety on every road. We service brake pads, high-performance rotors, calipers, ABS sensors, brake lines, and hydraulic fluid systems.",
        features: [
          "Pad & rotor inspection with digital micrometer measurement",
          "Ceramic & semi-metallic brake pad installation",
          "Brake caliper rebuild or replacement",
          "Brake fluid flush & hydraulic system bleed",
          "ABS diagnostic testing"
        ],
        turnaroundTime: "Usually completed in 2\u20134 hours",
        commonSymptoms: ["Squeaking or grinding sounds", "Spongy brake pedal", "Vibration when stopping"],
        idealFor: "Any vehicle experiencing reduced braking response or noise"
      },
      "engine-services": {
        title: "Engine Services",
        shortDesc: "Reliable engine diagnostics, timing systems, fuel delivery, and repair solutions.",
        fullDesc: "From pinpointing check engine lights to timing belt/chain replacements, fuel injection servicing, cylinder head gaskets, and ignition repair, we keep your engine operating at peak efficiency.",
        features: [
          "Check Engine light OBD-II diagnostic scanning",
          "Spark plug, ignition coil & distributor service",
          "Timing belt / timing chain replacement",
          "Fuel injector cleaning & fuel pump replacement",
          "Gasket replacements & oil leak repairs"
        ],
        turnaroundTime: "Clear timeframe provided upon diagnostic",
        commonSymptoms: ["Engine misfiring", "Loss of power", "Oil leaks", "Excessive smoke"],
        idealFor: "Vehicles experiencing performance drops, misfires, or warning lights"
      },
      "preventive-maintenance": {
        title: "Preventive Maintenance",
        shortDesc: "Routine maintenance designed to extend vehicle longevity and prevent expensive future repairs.",
        fullDesc: "Proactive vehicle care scheduled according to factory recommendations. Keep your warranty intact and avoid surprise breakdowns with comprehensive fluid checks, filter changes, and multi-point inspections.",
        features: [
          "Full synthetic, blend & conventional oil changes",
          "Engine air filter & cabin pollen filter replacement",
          "Coolant, power steering & differential fluid service",
          "Tire rotation, pressure & tread depth check",
          "Comprehensive multi-point vehicle health check"
        ],
        turnaroundTime: "Quick in-and-out maintenance",
        idealFor: "Seasonal prep (Winter/Summer) and milestone vehicle mileage services"
      }
    }
  },
  pricing: {
    badge: "Honest Automotive Valuation",
    headline: "Quality Service.",
    headlineAccent: "Fair Pricing.",
    intro: "Every vehicle and repair is different. Contact us for a professional assessment and a clear quote based on your vehicle's needs.",
    strip: "Transparent \u2022 Fair \u2022 No Guesswork",
    card1: {
      label: "Personal & Commuter Vehicles",
      badge: "Custom Assessment",
      title: "Mechanical & Maintenance",
      desc: "Complete diagnostic assessment and repair estimate tailored to your exact make, model, and symptoms.",
      features: [
        "OBD-II Computer scan and diagnostic pinpointing",
        "Itemized parts and labor breakdown before approval",
        "Honest recommendation on urgent vs optional work",
        "Brake service, fluid flushes, suspension, and engine repairs",
        "Fair local rates with premium component options"
      ],
      cta: "Request Mechanical Quote"
    },
    card2: {
      topBadge: "Specialized Service",
      label: "Transmission Department",
      badge: "Specialist Rate",
      title: "Transmission Diagnostics & Rebuilds",
      desc: "Specialized transmission analysis for shifting issues, slipping gears, solenoid faults, or complete rebuilds.",
      features: [
        "Specialized electronic sensor & hydraulic pressure testing",
        "Fluid condition & metal particle contamination check",
        "Repair options: Solenoid/valve body fix vs complete rebuild",
        "Direct service for vehicle owners and partner mechanic garages",
        "Clear, upfront quotation with Abdul prior to any disassembly"
      ],
      cta: "Request Transmission Assessment"
    },
    faqTitle: "Frequently Asked Pricing & Service Questions",
    faqs: [
      {
        q: "How do I know if my transmission needs repair versus simple maintenance?",
        a: "If you notice slipping gears, hard shifting, delayed engagement into Drive/Reverse, or leaking reddish fluid, an inspection is critical. Minor issues like dirty fluid or a sensor fault can often be serviced quickly before damaging internal gears."
      },
      {
        q: "Do you provide services for other mechanic shops?",
        a: "Yes. We frequently partner with independent auto repair garages that require dedicated transmission diagnostics, valve body rebuilds, or complete transmission overhauls."
      },
      {
        q: "How do I get an estimate for my car?",
        a: "You can call Abdul directly at (514) 553-4206 or submit the online quote form with your vehicle's make, model, year, and description of symptoms for an upfront assessment."
      },
      {
        q: "What types of transmissions do you service?",
        a: "We service automatic transmissions, standard manual gearboxes, Continuously Variable Transmissions (CVT), and dual-clutch systems on domestic, European, and Asian vehicles."
      }
    ]
  },
  testimonials: {
    badge: "Reputation & Trust",
    headline: "Trusted by",
    headlineAccent: "Our Customers",
    intro: "See how drivers and independent partner garages rely on {shortName} for dependable auto repair and transmission solutions.",
    verified: "Verified",
    footNote: "Committed to honest service, fair pricing, and dependable repairs for every client.",
    items: [
      {
        id: "t1",
        name: "Marc L.",
        role: "Vehicle Owner",
        vehicle: "2018 Honda Accord",
        serviceCategory: "Transmission Diagnostics & Repair",
        content: "My transmission was slipping between 2nd and 3rd gear and other shops quoted me outrageous prices for a full replacement. Abdul diagnosed a faulty solenoid and resolved it for a fraction of the price. Extremely honest and professional.",
        date: "Recent Customer"
      },
      {
        id: "t2",
        name: "S. Tremblay",
        role: "Local Garage Owner",
        vehicle: "B2B Transmission Partnership",
        serviceCategory: "Transmission Sub-Contracting",
        content: "Whenever our garage gets a complex transmission rebuild that requires specialist tooling, we send it to Abdul at Garage Services. Fast turnaround, impeccable work, and trustworthy communication every time.",
        date: "Partner Shop"
      },
      {
        id: "t3",
        name: "David K.",
        role: "Commuter & Family Driver",
        vehicle: "2019 Toyota RAV4",
        serviceCategory: "Brake & Engine Service",
        content: "Took my SUV in for brake replacement and scheduled maintenance. The service was fast, the pricing was very fair, and the car drives like new. Highly recommend Abdul and his team to anyone looking for reliable mechanics.",
        date: "Recent Customer"
      }
    ]
  },
  leadCta: {
    badge: "Direct Diagnostic Consultation",
    headlineLine1: "Need Auto Repair or",
    headlineAccent: "Transmission Service?",
    intro: "Tell us what your vehicle needs and our team will help you find the right solution. Fast assessment, transparent communication, and honest pricing.",
    note1: "\u2022 Free Consultation",
    note2: "\u2022 No Obligation Quotes",
    note3: "\u2022 Direct Talk with Abdul"
  },
  contact: {
    badge: "Direct Communication",
    headline: "Get In Touch With",
    headlineAccent: "Our Specialists",
    intro: "Fill out the form below for an upfront quote or call Abdul directly for immediate assistance.",
    attn: "Attn: {name} \u2022 Master Diagnostic Lead",
    phoneLabel: "Direct Telephone",
    emailLabel: "Email Inquiries",
    socialLabel: "Social Media",
    areaTitle: "Service Area & Workshop Intake",
    areaNotice: "Serving Montreal & Greater Metropolitan Area. Mobile consultations and shop intake available.",
    areaNote: "Call ahead for intake scheduling & diagnostic bays.",
    formTitle: "Request a Free Quote",
    formIntro: "Tell us about your vehicle symptoms or required maintenance.",
    successTitle: "Quote Request Received",
    successBody: "Thank you, {name}. Abdul will review your vehicle details ({vehicle}) and get back to you promptly at {phone}.",
    successCall: "Call Abdul Now For Urgent Need",
    successReset: "Submit Another Vehicle",
    submit: "Request a Quote",
    submitting: "Sending Details to Abdul...",
    dispatchNote: "Direct confidential dispatch to Abdul ({email})",
    fields: {
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. John Doe",
      namePlaceholder: "Your Name",
      phone: "Phone Number",
      phonePlaceholder: "e.g. (514) 553-4206",
      email: "Email Address",
      emailPlaceholder: "e.g. yourname@gmail.com",
      emailShortPlaceholder: "name@email.com",
      vehicle: "Vehicle Make & Model",
      vehiclePlaceholder: "e.g. 2018 Honda Civic",
      vehicleShortPlaceholder: "e.g. 2017 Ford F-150",
      service: "Service Needed",
      transmissionType: "Transmission Type",
      message: "Describe Symptoms / Request Details (Optional)",
      messagePlaceholder: "e.g. Shifting jerk between 2nd and 3rd gear, warning light on dashboard...",
      messageShort: "Symptoms / Notes",
      messageShortPlaceholder: "Brief note about the issue or required work..."
    },
    transmissionOptions: {
      automatic: "Automatic",
      manual: "Manual / Standard",
      cvt: "CVT (Continuously Variable)",
      dualClutch: "Dual-Clutch / DSG",
      unsureInspection: "Unsure / Need Inspection",
      unsureDiagnosis: "Unsure / Need Diagnosis"
    },
    errors: {
      fullName: "Please provide your full name.",
      fullNameShort: "Full name is required.",
      phoneRequired: "Please provide a valid phone number for contact.",
      phoneShort: "Phone number is required.",
      phoneInvalid: "Please enter a valid 10-digit phone number.",
      emailRequired: "Please provide your email address.",
      emailShort: "Email address is required.",
      emailInvalid: "Please enter a valid email address.",
      vehicle: "Please specify your vehicle make & model.",
      vehicleShort: "Vehicle make & model required.",
      submitFailed: "We could not send your request. Please try again or call Abdul directly."
    }
  },
  quoteModal: {
    eyebrow: "Direct Estimation System",
    title: "Get a Free Quote",
    intro: "Fast turnaround with honest, transparent pricing from Abdul.",
    ariaClose: "Close quote modal",
    successTitle: "Quote Request Dispatched",
    successBody: "Thank you, {name}. Abdul will review your vehicle details ({vehicle}) and contact you shortly at {phone}.",
    done: "Done",
    submit: "Submit Quote Request",
    submitting: "Submitting..."
  },
  footer: {
    bannerEyebrow: "Dependable Automotive Care",
    bannerTitle: "Ready to Get Your Vehicle Diagnosed?",
    bio: "Professional automotive service, honest pricing, and dependable repairs you can trust. Complete automotive repair, precision transmission rebuilds, and diagnostic services for drivers and partner garages.",
    badge: "Dedicated Quality & Transparent Pricing",
    navTitle: "Navigation",
    servicesTitle: "Core Specialties",
    contactTitle: "Direct Contact",
    leadContact: "Lead Contact",
    phone: "Phone",
    email: "Email",
    social: "Social Media",
    rights: "\xA9 2026 {name}. All rights reserved.",
    backToTop: "Back to top",
    links: {
      home: "Home",
      about: "About Us",
      services: "Services",
      pricing: "Pricing & FAQs",
      testimonials: "Testimonials",
      contact: "Contact & Location",
      blog: "Blog"
    }
  }
};

// src/i18n/fr.ts
var fr = {
  meta: {
    htmlLang: "fr",
    title: "Garage Services Auto et Centre de Transmission | R\xE9paration automobile et sp\xE9cialiste de la transmission",
    description: "Garage Services Auto et Centre de Transmission offre des services de r\xE9paration automobile et de transmission fiables, \xE0 prix juste, \xE0 Montr\xE9al. Contactez Abdul au (514) 553-4206."
  },
  blog: {
    eyebrow: "Conseils et actualit\xE9s",
    title: "Blogue",
    subtitle: "Conseils d'entretien, diagnostics de transmission et actualit\xE9s de l'atelier, r\xE9dig\xE9s par notre \xE9quipe.",
    meta: {
      title: "Blogue | Garage Services Auto et Centre de Transmission",
      description: "Conseils d'entretien automobile, diagnostics de transmission et actualit\xE9s du Garage Services Auto et Centre de Transmission \xE0 Montr\xE9al."
    }
  },
  language: {
    label: "Langue",
    fr: "FR",
    en: "EN",
    switchToFr: "Passer en fran\xE7ais",
    switchToEn: "Passer en anglais"
  },
  common: {
    businessName: "Garage Services Auto et Centre de Transmission",
    getQuote: "Obtenir une soumission",
    getFreeQuote: "Soumission gratuite",
    requestFreeQuote: "Demander une soumission gratuite",
    callAbdul: "Appeler Abdul",
    call: "Appeler",
    close: "Fermer",
    details: "D\xE9tails",
    quote: "Soumission",
    location: "Montr\xE9al, QC"
  },
  nav: {
    home: "Accueil",
    about: "\xC0 propos",
    services: "Services",
    pricing: "Tarifs",
    testimonials: "T\xE9moignages",
    contact: "Contact",
    ariaMain: "Navigation principale",
    ariaToggleMenu: "Ouvrir ou fermer le menu mobile",
    ariaLogo: "Garage Services Auto et Centre de Transmission - Retour en haut",
    callAbdulWithPhone: "Appeler Abdul : {phone}"
  },
  loader: {
    status: "Initialisation de la baie de diagnostic..."
  },
  offline: {
    badge: "Hors ligne",
    title: "Aucune connexion Internet",
    description: "Nous n'arrivons pas \xE0 joindre le r\xE9seau. V\xE9rifiez votre connexion Wi-Fi ou vos donn\xE9es mobiles, puis r\xE9essayez.",
    retry: "R\xE9essayer",
    checking: "V\xE9rification...",
    callPrompt: "Besoin de nous joindre maintenant ? Appelez-nous directement :"
  },
  logo: {
    tagline: "Montr\xE9al \u2022 Pr\xE9cision sp\xE9cialis\xE9e",
    line2: "CENTRE AUTO & TRANSMISSION",
    altEmblem: "Embl\xE8me officiel du Garage Services Auto et Centre de Transmission"
  },
  hero: {
    eyebrow: "Sp\xE9cialiste de la transmission et de l'auto \xE0 Montr\xE9al",
    headlineLine1: "Votre r\xE9paration",
    headlineAccent: "automobile",
    headlineLine3: "et transmission",
    subtext: "Un service automobile professionnel sur lequel vous pouvez compter. R\xE9parations fiables, r\xE9visions de transmission expertes et prix honn\xEAtes pour les automobilistes comme pour les garages partenaires.",
    primaryCta: "Parler \xE0 un sp\xE9cialiste",
    directWorkshop: "Atelier direct",
    locationLabel: "Emplacement",
    imageAlt: "Atelier moderne de r\xE9paration automobile et baie de diagnostic de transmission",
    trust1: "25+ ann\xE9es d'exp\xE9rience",
    trust2: "Prix justes et clairs",
    trust3: "Diagnostic par technicien expert",
    cards: [
      {
        serviceId: "transmission-services",
        title: "R\xE9vision et reconstruction de transmission",
        desc: "Reconstructions de pr\xE9cision, correction des glissements de vitesses et calibration du convertisseur de couple."
      },
      {
        serviceId: "brake-services",
        title: "Freins et syst\xE8mes de freinage",
        desc: "Entretien de la puissance de freinage, remplacement des disques et d\xE9pannage du syst\xE8me ABS."
      },
      {
        serviceId: "transmission-diagnostics",
        title: "Diagnostic informatis\xE9 du moteur",
        desc: "Balayage informatique de pointe pour isoler les voyants d'avertissement et les pertes de performance."
      }
    ],
    intakeBanner: "Pr\xEAt pour une prise en charge imm\xE9diate"
  },
  trustBar: {
    pillarLabel: "Pilier",
    pillars: {
      professional: {
        title: "Service professionnel",
        subtitle: "Solutions automobiles expertes",
        description: "Outils de diagnostic certifi\xE9s et inspection m\xE9ticuleuse \xE0 chaque r\xE9paration."
      },
      pricing: {
        title: "Prix justes",
        subtitle: "Un service de qualit\xE9 sans co\xFBts inutiles",
        description: "Soumissions transparentes et recommandations honn\xEAtes, sans frais cach\xE9s."
      },
      transmission: {
        title: "Sp\xE9cialistes de la transmission",
        subtitle: "Expertise sp\xE9cialis\xE9e en transmission",
        description: "Reconstructions compl\xE8tes, changement de fluide, diagnostics et r\xE9parations : automatique, manuelle et CVT."
      },
      customer: {
        title: "Ax\xE9 sur le client",
        subtitle: "Un service b\xE2ti autour de vos besoins",
        description: "Explications claires, suivis rapides et un service respectueux qui place le client en premier."
      }
    }
  },
  about: {
    eyebrow: "H\xE9ritage et savoir-faire",
    headlineLine1: "Une expertise automobile",
    headlineAccent: "digne de confiance",
    badgeBay: "Baie de diagnostic de transmission",
    leadTechLabel: "Technicien principal",
    leadTechName: "Abdul \u2022 Responsable du diagnostic",
    imageAlt: "M\xE9canicien professionnel inspectant un moteur et une transmission chez Garage Services",
    ariaCall: "Appeler Abdul directement",
    intro: "Garage Services Auto et Centre de Transmission se consacre au diagnostic honn\xEAte, aux reconstructions de transmission de pr\xE9cision et \xE0 un entretien automobile fiable.",
    paragraph: "Nous sommes fiers de servir autant les propri\xE9taires de v\xE9hicules \xE0 la recherche de r\xE9parations fiables que les garages m\xE9caniques professionnels ayant besoin d'un sous-traitant de confiance en transmission et en diagnostic de haute pr\xE9cision.",
    highlights: [
      {
        num: "01",
        title: "Service professionnel",
        desc: "Des normes rigoureuses et un \xE9quipement de diagnostic certifi\xE9 sur chaque v\xE9hicule."
      },
      {
        num: "02",
        title: "Prix justes et clairs",
        desc: "Des estimations honn\xEAtes et d\xE9taill\xE9es, sans co\xFBts surprises ni ventes inutiles."
      },
      {
        num: "03",
        title: "Travail fiable",
        desc: "Des r\xE9parations bien faites du premier coup, avec des composants de qualit\xE9 sup\xE9rieure."
      },
      {
        num: "04",
        title: "Expertise en transmission",
        desc: "Sp\xE9cialis\xE9s dans les reconstructions, diagnostics et r\xE9visions de transmission en profondeur."
      },
      {
        num: "05",
        title: "Le client avant tout",
        desc: "Une communication transparente et une consultation directe et accessible avec Abdul."
      }
    ]
  },
  services: {
    eyebrow: "Baie de diagnostic de pr\xE9cision",
    headlineLine1: "Des services",
    headlineAccent: "automobiles sp\xE9cialis\xE9s",
    intro: "De la reconstruction compl\xE8te de transmission aux r\xE9parations de freins de pr\xE9cision et au diagnostic informatis\xE9.",
    filters: {
      all: "Tous les services",
      transmission: "Transmission",
      mechanical: "M\xE9canique",
      maintenance: "Entretien"
    },
    specialtyBadge: "Sp\xE9cialit\xE9",
    getQuote: "Soumission",
    ariaQuoteFor: "Obtenir une soumission pour {service}",
    modal: {
      overview: "Aper\xE7u du service",
      scope: "Port\xE9e des travaux et capacit\xE9s",
      symptomsTitle: "Sympt\xF4mes courants indiquant ce service :",
      idealFor: "Id\xE9al pour :",
      ariaClose: "Fermer la fen\xEAtre",
      cta: "R\xE9server / demander une soumission"
    },
    items: {
      "auto-repair": {
        title: "R\xE9paration automobile",
        shortDesc: "Des r\xE9parations automobiles professionnelles pour garder votre v\xE9hicule fiable et performant.",
        fullDesc: "Des services de r\xE9paration m\xE9canique complets, du pare-chocs au pare-chocs. Du d\xE9pannage \xE9lectrique aux r\xE9parations de suspension, en passant par les syst\xE8mes d'\xE9chappement et de refroidissement, nous ciblons la cause r\xE9elle et livrons des r\xE9parations durables.",
        features: [
          "Inspection de s\xE9curit\xE9 compl\xE8te du v\xE9hicule",
          "R\xE9paration de la suspension et de la direction",
          "Diagnostic de l'alternateur, de la batterie et du d\xE9marreur",
          "Entretien du syst\xE8me de refroidissement, du radiateur et de la pompe \xE0 eau",
          "R\xE9paration de l'\xE9chappement et des \xE9missions"
        ],
        turnaroundTime: "Travaux compl\xE9t\xE9s le jour m\xEAme ou le lendemain",
        idealFor: "Toutes les marques et mod\xE8les n\xE9cessitant une r\xE9paration m\xE9canique ou \xE9lectrique"
      },
      "transmission-services": {
        title: "Services de transmission",
        shortDesc: "Inspection, r\xE9paration, reconstruction et entretien complet de transmission, en sp\xE9cialiste.",
        fullDesc: "Notre sp\xE9cialit\xE9 phare. Nous prenons en charge l'entretien complexe des transmissions, les rin\xE7ages de fluide, le remplacement des sol\xE9no\xEFdes et de l'embrayage, ainsi que les reconstructions compl\xE8tes avec une pr\xE9cision d'ing\xE9nierie.",
        features: [
          "Expertise automatique, manuelle, CVT et double embrayage",
          "Rin\xE7age complet du fluide et remplacement du filtre",
          "Reconstruction de transmission et remplacement des engrenages",
          "R\xE9paration du convertisseur de couple et du corps de valves",
          "Service B2B pour les garages m\xE9caniques partenaires"
        ],
        turnaroundTime: "D\xE9lai rapide avec tests d\xE9taill\xE9s",
        commonSymptoms: ["Glissement des vitesses", "Passages brusques", "Engagement retard\xE9", "Fuites de fluide"],
        idealFor: "Automobilistes et ateliers m\xE9caniques n\xE9cessitant un soin sp\xE9cialis\xE9 de la transmission"
      },
      "transmission-diagnostics": {
        title: "Diagnostic de transmission",
        shortDesc: "Identifiez les probl\xE8mes de transmission avec pr\xE9cision avant qu'ils ne deviennent co\xFBteux.",
        fullDesc: "Un diagnostic informatique avanc\xE9 combin\xE9 au balayage des capteurs \xE9lectroniques et \xE0 des essais routiers hydrauliques pour isoler les d\xE9faillances de transmission sans deviner.",
        features: [
          "Lecture des codes d'erreur et donn\xE9es en direct",
          "Test des sol\xE9no\xEFdes et capteurs \xE9lectroniques",
          "Test de pression hydraulique et essai routier",
          "Analyse de l'\xE9tat et de la contamination du fluide",
          "Rapport de diagnostic d\xE9taill\xE9 avant toute r\xE9paration"
        ],
        turnaroundTime: "Inspection rapide disponible",
        commonSymptoms: [
          "Voyant moteur / transmission allum\xE9",
          "Mont\xE9es de r\xE9gime anormales",
          "Secousses lors des changements de vitesse"
        ],
        idealFor: "V\xE9hicules avec des probl\xE8mes de passage intermittents ou des voyants de transmission"
      },
      "brake-services": {
        title: "Services de freins",
        shortDesc: "Inspection, entretien, rectification des disques et r\xE9paration compl\xE8te des freins.",
        fullDesc: "Assurez une puissance de freinage maximale et une s\xE9curit\xE9 constante sur la route. Nous entretenons les plaquettes, les disques haute performance, les \xE9triers, les capteurs ABS, les conduites et les syst\xE8mes hydrauliques.",
        features: [
          "Inspection des plaquettes et disques au microm\xE8tre num\xE9rique",
          "Installation de plaquettes c\xE9ramiques ou semi-m\xE9talliques",
          "R\xE9fection ou remplacement des \xE9triers de frein",
          "Rin\xE7age du liquide de frein et purge du syst\xE8me hydraulique",
          "Test de diagnostic ABS"
        ],
        turnaroundTime: "G\xE9n\xE9ralement compl\xE9t\xE9 en 2 \xE0 4 heures",
        commonSymptoms: ["Grincements ou frottements", "P\xE9dale de frein spongieuse", "Vibrations au freinage"],
        idealFor: "Tout v\xE9hicule pr\xE9sentant une r\xE9ponse de freinage r\xE9duite ou des bruits anormaux"
      },
      "engine-services": {
        title: "Services moteur",
        shortDesc: "Diagnostic moteur fiable, syst\xE8mes de distribution, alimentation en carburant et r\xE9parations.",
        fullDesc: "Du diagnostic du voyant moteur au remplacement de la courroie ou de la cha\xEEne de distribution, en passant par l'injection, les joints de culasse et l'allumage, nous maintenons votre moteur \xE0 son rendement optimal.",
        features: [
          "Balayage OBD-II du voyant moteur",
          "Entretien des bougies, bobines d'allumage et distributeur",
          "Remplacement de la courroie ou cha\xEEne de distribution",
          "Nettoyage des injecteurs et remplacement de la pompe \xE0 essence",
          "Remplacement des joints et r\xE9paration des fuites d'huile"
        ],
        turnaroundTime: "\xC9ch\xE9ancier clair fourni apr\xE8s le diagnostic",
        commonSymptoms: ["Rat\xE9s du moteur", "Perte de puissance", "Fuites d'huile", "Fum\xE9e excessive"],
        idealFor: "V\xE9hicules pr\xE9sentant une baisse de performance, des rat\xE9s ou des voyants allum\xE9s"
      },
      "preventive-maintenance": {
        title: "Entretien pr\xE9ventif",
        shortDesc: "Un entretien r\xE9gulier pour prolonger la vie du v\xE9hicule et \xE9viter les r\xE9parations co\xFBteuses.",
        fullDesc: "Un entretien proactif planifi\xE9 selon les recommandations du fabricant. Pr\xE9servez votre garantie et \xE9vitez les bris impr\xE9vus gr\xE2ce aux v\xE9rifications de fluides, aux changements de filtres et aux inspections multipoints.",
        features: [
          "Changements d'huile synth\xE9tique, semi-synth\xE9tique et conventionnelle",
          "Remplacement du filtre \xE0 air moteur et du filtre d'habitacle",
          "Entretien du liquide de refroidissement, de la direction et du diff\xE9rentiel",
          "Rotation des pneus, pression et v\xE9rification de l'usure",
          "Inspection multipoint compl\xE8te du v\xE9hicule"
        ],
        turnaroundTime: "Entretien rapide, entr\xE9e et sortie",
        idealFor: "Pr\xE9paration saisonni\xE8re (hiver/\xE9t\xE9) et entretiens selon le kilom\xE9trage"
      }
    }
  },
  pricing: {
    badge: "\xC9valuation automobile honn\xEAte",
    headline: "Service de qualit\xE9.",
    headlineAccent: "Prix justes.",
    intro: "Chaque v\xE9hicule et chaque r\xE9paration sont diff\xE9rents. Contactez-nous pour une \xE9valuation professionnelle et une soumission claire, adapt\xE9e aux besoins de votre v\xE9hicule.",
    strip: "Transparent \u2022 Juste \u2022 Sans devinettes",
    card1: {
      label: "V\xE9hicules personnels et quotidiens",
      badge: "\xC9valuation sur mesure",
      title: "M\xE9canique et entretien",
      desc: "\xC9valuation diagnostique compl\xE8te et estimation de r\xE9paration adapt\xE9e \xE0 votre marque, mod\xE8le et sympt\xF4mes.",
      features: [
        "Balayage informatique OBD-II et ciblage du diagnostic",
        "D\xE9tail des pi\xE8ces et de la main-d'\u0153uvre avant approbation",
        "Recommandation honn\xEAte entre travaux urgents et optionnels",
        "Freins, rin\xE7ages de fluides, suspension et r\xE9parations moteur",
        "Tarifs locaux justes avec options de composants de qualit\xE9 sup\xE9rieure"
      ],
      cta: "Demander une soumission m\xE9canique"
    },
    card2: {
      topBadge: "Service sp\xE9cialis\xE9",
      label: "D\xE9partement transmission",
      badge: "Tarif sp\xE9cialiste",
      title: "Diagnostic et reconstruction de transmission",
      desc: "Analyse sp\xE9cialis\xE9e pour les probl\xE8mes de passage, le glissement des vitesses, les d\xE9faillances de sol\xE9no\xEFdes ou les reconstructions compl\xE8tes.",
      features: [
        "Test sp\xE9cialis\xE9 des capteurs \xE9lectroniques et de la pression hydraulique",
        "V\xE9rification de l'\xE9tat du fluide et des particules m\xE9talliques",
        "Options : r\xE9paration du sol\xE9no\xEFde/corps de valves ou reconstruction compl\xE8te",
        "Service direct aux propri\xE9taires et aux garages partenaires",
        "Soumission claire avec Abdul avant tout d\xE9montage"
      ],
      cta: "Demander une \xE9valuation de transmission"
    },
    faqTitle: "Questions fr\xE9quentes sur les prix et les services",
    faqs: [
      {
        q: "Comment savoir si ma transmission a besoin d'une r\xE9paration ou d'un simple entretien ?",
        a: "Si vous remarquez un glissement des vitesses, des passages brusques, un engagement retard\xE9 en Drive/Reverse ou une fuite de fluide rouge\xE2tre, une inspection est essentielle. Les probl\xE8mes mineurs, comme un fluide encrass\xE9 ou un capteur d\xE9fectueux, peuvent souvent \xEAtre r\xE9gl\xE9s rapidement avant d'endommager les engrenages."
      },
      {
        q: "Offrez-vous vos services \xE0 d'autres ateliers m\xE9caniques ?",
        a: "Oui. Nous collaborons r\xE9guli\xE8rement avec des garages ind\xE9pendants qui ont besoin de diagnostics de transmission sp\xE9cialis\xE9s, de reconstructions de corps de valves ou de r\xE9visions compl\xE8tes."
      },
      {
        q: "Comment obtenir une estimation pour mon v\xE9hicule ?",
        a: "Vous pouvez appeler Abdul directement au (514) 553-4206 ou remplir le formulaire en ligne avec la marque, le mod\xE8le, l'ann\xE9e et la description des sympt\xF4mes pour une \xE9valuation initiale."
      },
      {
        q: "Quels types de transmissions r\xE9parez-vous ?",
        a: "Nous entretenons les transmissions automatiques, les bo\xEEtes manuelles, les transmissions \xE0 variation continue (CVT) et les syst\xE8mes \xE0 double embrayage sur les v\xE9hicules nord-am\xE9ricains, europ\xE9ens et asiatiques."
      }
    ]
  },
  testimonials: {
    badge: "R\xE9putation et confiance",
    headline: "La confiance de",
    headlineAccent: "nos clients",
    intro: "D\xE9couvrez comment les automobilistes et les garages partenaires ind\xE9pendants comptent sur {shortName} pour des r\xE9parations automobiles et des solutions de transmission fiables.",
    verified: "V\xE9rifi\xE9",
    footNote: "Engag\xE9s envers un service honn\xEAte, des prix justes et des r\xE9parations fiables pour chaque client.",
    items: [
      {
        id: "t1",
        name: "Marc L.",
        role: "Propri\xE9taire de v\xE9hicule",
        vehicle: "Honda Accord 2018",
        serviceCategory: "Diagnostic et r\xE9paration de transmission",
        content: "Ma transmission glissait entre la 2e et la 3e vitesse et d'autres ateliers me demandaient des prix exorbitants pour un remplacement complet. Abdul a diagnostiqu\xE9 un sol\xE9no\xEFde d\xE9fectueux et l'a r\xE9gl\xE9 pour une fraction du prix. Extr\xEAmement honn\xEAte et professionnel.",
        date: "Client r\xE9cent"
      },
      {
        id: "t2",
        name: "S. Tremblay",
        role: "Propri\xE9taire de garage local",
        vehicle: "Partenariat transmission B2B",
        serviceCategory: "Sous-traitance en transmission",
        content: "Chaque fois que notre garage re\xE7oit une reconstruction de transmission complexe n\xE9cessitant un outillage sp\xE9cialis\xE9, nous l'envoyons \xE0 Abdul chez Garage Services. D\xE9lais rapides, travail impeccable et communication fiable \xE0 chaque fois.",
        date: "Atelier partenaire"
      },
      {
        id: "t3",
        name: "David K.",
        role: "Conducteur familial",
        vehicle: "Toyota RAV4 2019",
        serviceCategory: "Service de freins et moteur",
        content: "J'ai fait remplacer les freins de mon VUS et effectuer l'entretien pr\xE9vu. Le service a \xE9t\xE9 rapide, le prix tr\xE8s juste et la voiture roule comme neuve. Je recommande fortement Abdul et son \xE9quipe \xE0 toute personne cherchant des m\xE9caniciens fiables.",
        date: "Client r\xE9cent"
      }
    ]
  },
  leadCta: {
    badge: "Consultation diagnostique directe",
    headlineLine1: "Besoin d'une r\xE9paration auto ou",
    headlineAccent: "d'un service de transmission ?",
    intro: "Dites-nous ce dont votre v\xE9hicule a besoin et notre \xE9quipe vous aidera \xE0 trouver la bonne solution. \xC9valuation rapide, communication transparente et prix honn\xEAtes.",
    note1: "\u2022 Consultation gratuite",
    note2: "\u2022 Soumissions sans engagement",
    note3: "\u2022 Discussion directe avec Abdul"
  },
  contact: {
    badge: "Communication directe",
    headline: "Contactez",
    headlineAccent: "nos sp\xE9cialistes",
    intro: "Remplissez le formulaire ci-dessous pour une soumission claire, ou appelez Abdul directement pour une aide imm\xE9diate.",
    attn: "Att. : {name} \u2022 Responsable du diagnostic",
    phoneLabel: "T\xE9l\xE9phone direct",
    emailLabel: "Demandes par courriel",
    socialLabel: "R\xE9seaux sociaux",
    areaTitle: "Zone de service et prise en charge \xE0 l'atelier",
    areaNotice: "Desservant Montr\xE9al et la grande r\xE9gion m\xE9tropolitaine. Consultations mobiles et prise en charge \xE0 l'atelier disponibles.",
    areaNote: "Appelez \xE0 l'avance pour planifier la prise en charge et la baie de diagnostic.",
    formTitle: "Demander une soumission gratuite",
    formIntro: "Parlez-nous des sympt\xF4mes de votre v\xE9hicule ou de l'entretien requis.",
    successTitle: "Demande de soumission re\xE7ue",
    successBody: "Merci, {name}. Abdul examinera les d\xE9tails de votre v\xE9hicule ({vehicle}) et vous rappellera rapidement au {phone}.",
    successCall: "Appeler Abdul pour un besoin urgent",
    successReset: "Soumettre un autre v\xE9hicule",
    submit: "Demander une soumission",
    submitting: "Envoi des d\xE9tails \xE0 Abdul...",
    dispatchNote: "Transmission confidentielle directe \xE0 Abdul ({email})",
    fields: {
      fullName: "Nom complet",
      fullNamePlaceholder: "ex. Jean Tremblay",
      namePlaceholder: "Votre nom",
      phone: "Num\xE9ro de t\xE9l\xE9phone",
      phonePlaceholder: "ex. (514) 553-4206",
      email: "Adresse courriel",
      emailPlaceholder: "ex. votrenom@gmail.com",
      emailShortPlaceholder: "nom@courriel.com",
      vehicle: "Marque et mod\xE8le du v\xE9hicule",
      vehiclePlaceholder: "ex. Honda Civic 2018",
      vehicleShortPlaceholder: "ex. Ford F-150 2017",
      service: "Service requis",
      transmissionType: "Type de transmission",
      message: "D\xE9crivez les sympt\xF4mes / d\xE9tails de la demande (facultatif)",
      messagePlaceholder: "ex. Secousse au passage entre la 2e et la 3e, voyant allum\xE9 au tableau de bord...",
      messageShort: "Sympt\xF4mes / notes",
      messageShortPlaceholder: "Courte note sur le probl\xE8me ou les travaux requis..."
    },
    transmissionOptions: {
      automatic: "Automatique",
      manual: "Manuelle / standard",
      cvt: "CVT (\xE0 variation continue)",
      dualClutch: "Double embrayage / DSG",
      unsureInspection: "Incertain / inspection requise",
      unsureDiagnosis: "Incertain / diagnostic requis"
    },
    errors: {
      fullName: "Veuillez indiquer votre nom complet.",
      fullNameShort: "Le nom complet est requis.",
      phoneRequired: "Veuillez fournir un num\xE9ro de t\xE9l\xE9phone valide.",
      phoneShort: "Le num\xE9ro de t\xE9l\xE9phone est requis.",
      phoneInvalid: "Veuillez entrer un num\xE9ro de t\xE9l\xE9phone valide \xE0 10 chiffres.",
      emailRequired: "Veuillez indiquer votre adresse courriel.",
      emailShort: "L'adresse courriel est requise.",
      emailInvalid: "Veuillez entrer une adresse courriel valide.",
      vehicle: "Veuillez pr\xE9ciser la marque et le mod\xE8le de votre v\xE9hicule.",
      vehicleShort: "La marque et le mod\xE8le sont requis.",
      submitFailed: "Nous n'avons pas pu envoyer votre demande. Veuillez r\xE9essayer ou appeler Abdul directement."
    }
  },
  quoteModal: {
    eyebrow: "Syst\xE8me d'estimation directe",
    title: "Obtenir une soumission gratuite",
    intro: "D\xE9lai rapide avec des prix honn\xEAtes et transparents de la part d'Abdul.",
    ariaClose: "Fermer la fen\xEAtre de soumission",
    successTitle: "Demande de soumission envoy\xE9e",
    successBody: "Merci, {name}. Abdul examinera les d\xE9tails de votre v\xE9hicule ({vehicle}) et vous contactera sous peu au {phone}.",
    done: "Termin\xE9",
    submit: "Envoyer la demande",
    submitting: "Envoi en cours..."
  },
  footer: {
    bannerEyebrow: "Un entretien automobile fiable",
    bannerTitle: "Pr\xEAt \xE0 faire diagnostiquer votre v\xE9hicule ?",
    bio: "Un service automobile professionnel, des prix honn\xEAtes et des r\xE9parations fiables. R\xE9paration automobile compl\xE8te, reconstructions de transmission de pr\xE9cision et services de diagnostic pour les automobilistes et les garages partenaires.",
    badge: "Qualit\xE9 d\xE9di\xE9e et prix transparents",
    navTitle: "Navigation",
    servicesTitle: "Sp\xE9cialit\xE9s principales",
    contactTitle: "Contact direct",
    leadContact: "Personne-ressource",
    phone: "T\xE9l\xE9phone",
    email: "Courriel",
    social: "R\xE9seaux sociaux",
    rights: "\xA9 2026 {name}. Tous droits r\xE9serv\xE9s.",
    backToTop: "Retour en haut",
    links: {
      home: "Accueil",
      about: "\xC0 propos",
      services: "Services",
      pricing: "Tarifs et FAQ",
      testimonials: "T\xE9moignages",
      contact: "Contact et emplacement",
      blog: "Blogue"
    }
  }
};

// src/lib/constants.ts
var BUSINESS_INFO = {
  shortName: "Garage Services",
  contactPerson: "Abdul",
  phone: "(514) 553-4206",
  phoneRaw: "5145534206",
  email: "Servicesauto786@gmail.com",
  socialMediaName: "garage services auto and transmission center",
  logoUrl: "https://res.cloudinary.com/dobtsjhb2/image/upload/v1787785423/image_cx6qfr.png",
  heroImageUrl: "https://images.unsplash.com/photo-1613214149922-f1809c99b414?q=80&w=2070&auto=format&fit=crop",
  aboutImageUrl: "https://www.garageuae.com/wp-content/uploads/2022/02/car-transmission-service.jpg"
};
var SERVICE_META = [
  { id: "auto-repair", category: "mechanical", iconName: "Wrench" },
  { id: "transmission-services", category: "transmission", iconName: "Cpu" },
  { id: "transmission-diagnostics", category: "transmission", iconName: "Activity" },
  { id: "brake-services", category: "mechanical", iconName: "Disc" },
  { id: "engine-services", category: "mechanical", iconName: "Flame" },
  { id: "preventive-maintenance", category: "maintenance", iconName: "CheckCircle2" }
];
var TRUST_PILLAR_META = [
  { key: "professional", iconName: "ShieldCheck" },
  { key: "pricing", iconName: "BadgeDollarSign" },
  { key: "transmission", iconName: "Cog" },
  { key: "customer", iconName: "HeartHandshake" }
];
var TESTIMONIAL_META = {
  t1: { rating: 5, verified: true },
  t2: { rating: 5, verified: true },
  t3: { rating: 5, verified: true }
};

// server/seed.ts
var HERO_IMAGE = "https://images.unsplash.com/photo-1613214149922-f1809c99b414?q=80&w=2070&auto=format&fit=crop";
var ABOUT_IMAGE = "https://www.garageuae.com/wp-content/uploads/2022/02/car-transmission-service.jpg";
var loc = (frValue, enValue) => ({
  fr: frValue ?? "",
  en: enValue ?? ""
});
var locList = (frValue, enValue) => ({
  fr: frValue ?? [],
  en: enValue ?? []
});
var ensureAdminUser = async () => {
  const email = env.adminEmail;
  const existing = await AdminUser.findOne({ email });
  if (existing) return;
  await AdminUser.create({
    email,
    name: env.adminName,
    passwordHash: hashPassword(env.adminPassword)
  });
  console.log(`[seed] created admin account for ${email}`);
};
var adminBootstrap = null;
var ensureAdminUserOnce = async () => {
  if (!adminBootstrap) {
    adminBootstrap = ensureAdminUser().catch((error) => {
      adminBootstrap = null;
      console.error("[seed] admin bootstrap failed:", error.message);
    });
  }
  return adminBootstrap;
};
var upsert = async (model, query, doc, force) => {
  const existing = await model.findOne(query).lean();
  if (!existing) {
    await model.create(doc);
    return "created";
  }
  if (force) {
    await model.updateOne(query, { $set: doc });
    return "updated";
  }
  return "skipped";
};
var seedCategories = async (force) => {
  const keys = ["transmission", "mechanical", "maintenance"];
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
var seedServices = async (force) => {
  for (const [index, meta] of SERVICE_META.entries()) {
    const frCopy = fr.services.items[meta.id];
    const enCopy = en.services.items[meta.id];
    await upsert(
      Service,
      { slug: meta.id },
      {
        slug: meta.id,
        categoryKey: meta.category,
        iconName: meta.iconName,
        imageUrl: "",
        videoUrl: "",
        featured: meta.category === "transmission",
        published: true,
        order: index,
        title: loc(frCopy.title, enCopy.title),
        shortDesc: loc(frCopy.shortDesc, enCopy.shortDesc),
        fullDesc: loc(frCopy.fullDesc, enCopy.fullDesc),
        features: locList(frCopy.features, enCopy.features),
        commonSymptoms: locList(
          frCopy.commonSymptoms,
          enCopy.commonSymptoms
        ),
        turnaroundTime: loc(
          frCopy.turnaroundTime,
          enCopy.turnaroundTime
        ),
        idealFor: loc(frCopy.idealFor, enCopy.idealFor)
      },
      force
    );
  }
  console.log(`[seed] services: ${SERVICE_META.length}`);
};
var seedTrustPillars = async (force) => {
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
        order: index
      },
      force
    );
  }
  console.log(`[seed] trust pillars: ${TRUST_PILLAR_META.length}`);
};
var seedTestimonials = async (force) => {
  for (const [index, frItem] of fr.testimonials.items.entries()) {
    const enItem = en.testimonials.items.find((item) => item.id === frItem.id) ?? frItem;
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
        order: index
      },
      force
    );
  }
  console.log(`[seed] testimonials: ${fr.testimonials.items.length}`);
};
var seedFaqs = async (force) => {
  for (const [index, frFaq] of fr.pricing.faqs.entries()) {
    const enFaq = en.pricing.faqs[index] ?? frFaq;
    await upsert(
      Faq,
      { "question.fr": frFaq.q },
      {
        question: loc(frFaq.q, enFaq.q),
        answer: loc(frFaq.a, enFaq.a),
        published: true,
        order: index
      },
      force
    );
  }
  console.log(`[seed] faqs: ${fr.pricing.faqs.length}`);
};
var seedSettings = async (force) => {
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
    aboutImageUrl: ABOUT_IMAGE
  };
  const result = await upsert(Setting, { singleton: SETTINGS_KEY }, doc, force);
  console.log(`[seed] settings: ${result}`);
};
var runSeed = async (force) => {
  await connectToDatabase();
  await ensureAdminUser();
  await seedCategories(force);
  await seedServices(force);
  await seedTrustPillars(force);
  await seedTestimonials(force);
  await seedFaqs(force);
  await seedSettings(force);
};
var isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isEntryPoint) {
  const force = process.argv.includes("--force");
  runSeed(force).then(async () => {
    console.log(force ? "[seed] done (existing documents overwritten)" : "[seed] done");
    await disconnectFromDatabase();
    process.exit(0);
  }).catch(async (error) => {
    console.error("[seed] failed:", error.message);
    await disconnectFromDatabase().catch(() => {
    });
    process.exit(1);
  });
}

// server/index.ts
var __dirname = path2.dirname(fileURLToPath2(import.meta.url));
var distDir = path2.resolve(__dirname, "../dist");
var createApp = ({ serveStatic = env.isProduction } = {}) => {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "1mb" }));
  app.disable("x-powered-by");
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, data: { database: isDatabaseReady() ? "connected" : "disconnected" } });
  });
  app.use("/api", (_req, res, next) => {
    connectToDatabase().then(
      () => ensureAdminUserOnce().then(() => next()),
      () => {
        res.status(503).json({
          ok: false,
          error: "The content service is temporarily unavailable. Please try again shortly."
        });
      }
    );
  });
  app.use("/api/public", publicRouter);
  app.use("/api/admin/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", (_req, res) => {
    res.status(404).json({ ok: false, error: "Endpoint not found." });
  });
  if (serveStatic) {
    app.use(express.static(distDir, { index: false, maxAge: "1h" }));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distDir, "index.html"));
    });
  }
  app.use((error, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ ok: false, error: error.message, fields: error.fields });
      return;
    }
    if (error?.name === "ValidationError") {
      res.status(400).json({ ok: false, error: "Some fields are invalid. Please review the form." });
      return;
    }
    console.error("[api] unhandled error:", error);
    res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  });
  return app;
};
var isEntryPoint2 = process.argv[1] && fileURLToPath2(import.meta.url) === path2.resolve(process.argv[1]);
if (isEntryPoint2) {
  const app = createApp();
  app.listen(env.port, async () => {
    console.log(`[api] listening on http://localhost:${env.port}`);
    try {
      await connectToDatabase();
      console.log("[api] MongoDB connected");
      await ensureAdminUser();
    } catch (error) {
      console.error("[api] MongoDB connection failed:", error.message);
      console.error("[api] Check MONGODB_URI in your .env file. The API will retry per request.");
    }
  });
}

// server/vercel.ts
var vercel_default = createApp({ serveStatic: false });
export {
  vercel_default as default
};
