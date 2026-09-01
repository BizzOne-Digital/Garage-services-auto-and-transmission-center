import { Schema } from 'mongoose';

/** Reusable bilingual string field. */
export const localizedSchema = new Schema(
  {
    fr: { type: String, default: '', trim: true },
    en: { type: String, default: '', trim: true },
  },
  { _id: false }
);

/** Reusable bilingual list-of-strings field. */
export const localizedListSchema = new Schema(
  {
    fr: { type: [String], default: [] },
    en: { type: [String], default: [] },
  },
  { _id: false }
);

/** Strips Mongo internals from every JSON response. */
export const baseOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: false,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      ret._id = String(ret._id);
      return ret;
    },
  },
} as const;
