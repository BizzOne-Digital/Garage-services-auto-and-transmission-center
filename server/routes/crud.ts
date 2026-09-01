import { Router } from 'express';
import mongoose from 'mongoose';
import {
  asyncRoute,
  cleanNumber,
  cleanText,
  conflict,
  escapeRegex,
  notFound,
  sendOk,
} from '../http.ts';
import { invalidatePublicContentCache } from './public.ts';

export interface CrudOptions {
  model: mongoose.Model<any>;
  /** Turns an untrusted request body into a safe, fully-shaped document. */
  sanitize: (body: Record<string, unknown>, isCreate: boolean) => Record<string, unknown>;
  /** Dotted paths searched by the admin list's search box. */
  searchFields: string[];
  defaultSort: Record<string, 1 | -1>;
  /** Query-string keys that map 1:1 to an equality filter. */
  filterFields?: string[];
  /** Human name used in error messages. */
  label: string;
}

const DUPLICATE_KEY = 11000;

const describeDuplicate = (error: unknown, label: string) => {
  const key = Object.keys((error as { keyPattern?: Record<string, unknown> })?.keyPattern ?? {})[0];
  const field = key ?? 'value';
  return conflict(`Another ${label.toLowerCase()} already uses this ${field}.`, {
    [field]: 'Already in use.',
  });
};

const isDuplicate = (error: unknown): boolean =>
  (error as { code?: number })?.code === DUPLICATE_KEY;

/** Builds a protected list/create/read/update/delete router for one collection. */
export const createCrudRouter = (options: CrudOptions): Router => {
  const router = Router();
  const { model, sanitize, searchFields, defaultSort, filterFields = [], label } = options;

  router.get(
    '/',
    asyncRoute(async (req, res) => {
      const page = Math.max(1, cleanNumber(req.query.page, 1));
      const pageSize = Math.min(100, Math.max(1, cleanNumber(req.query.pageSize, 20)));
      const search = cleanText(req.query.search, 120);

      const filter: Record<string, unknown> = {};
      for (const field of filterFields) {
        const value = cleanText(req.query[field], 80);
        if (!value || value === 'all') continue;
        if (value === 'true' || value === 'false') filter[field] = value === 'true';
        else filter[field] = value;
      }
      if (search) {
        const pattern = new RegExp(escapeRegex(search), 'i');
        filter.$or = searchFields.map(field => ({ [field]: pattern }));
      }

      const [items, total] = await Promise.all([
        model
          .find(filter)
          .sort(defaultSort)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean(),
        model.countDocuments(filter),
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

  router.get(
    '/:id',
    asyncRoute(async (req, res) => {
      if (!mongoose.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const doc = await model.findById(req.params.id).lean();
      if (!doc) throw notFound(`${label} not found.`);
      sendOk(res, JSON.parse(JSON.stringify(doc)));
    })
  );

  router.post(
    '/',
    asyncRoute(async (req, res) => {
      const payload = sanitize((req.body ?? {}) as Record<string, unknown>, true);
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
    '/:id',
    asyncRoute(async (req, res) => {
      if (!mongoose.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const payload = sanitize((req.body ?? {}) as Record<string, unknown>, false);
      try {
        const doc = await model
          .findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true })
          .lean();
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
    '/:id',
    asyncRoute(async (req, res) => {
      if (!mongoose.isValidObjectId(req.params.id)) throw notFound(`${label} not found.`);
      const doc = await model.findByIdAndDelete(req.params.id).lean();
      if (!doc) throw notFound(`${label} not found.`);
      invalidatePublicContentCache();
      sendOk(res, { deleted: true, _id: String((doc as { _id: unknown })._id) });
    })
  );

  return router;
};
