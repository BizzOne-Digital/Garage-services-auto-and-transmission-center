import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

/** Single-document collection holding business identity and section imagery. */
const settingSchema = new Schema(
  {
    singleton: { type: String, default: 'site', unique: true, immutable: true },

    shortName: { type: String, default: '', trim: true },
    businessName: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    contactPerson: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    phoneRaw: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    socialMediaName: { type: String, default: '', trim: true },
    socialLinks: {
      type: [{ _id: false, label: String, url: String }],
      default: [],
    },
    logoUrl: { type: String, default: '', trim: true },
    heroImageUrl: { type: String, default: '', trim: true },
    aboutImageUrl: { type: String, default: '', trim: true },
  },
  baseOptions
);

export const Setting: mongoose.Model<any> =
  (mongoose.models.Setting as mongoose.Model<any>) ||
  mongoose.model('Setting', settingSchema);

export const SETTINGS_KEY = 'site';
