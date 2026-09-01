import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedListSchema, localizedSchema } from './shared.ts';

const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    categoryKey: { type: String, required: true, trim: true, lowercase: true },
    iconName: { type: String, default: 'Wrench', trim: true },
    imageUrl: { type: String, default: '', trim: true },
    videoUrl: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    title: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    shortDesc: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    fullDesc: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    features: { type: localizedListSchema, default: () => ({ fr: [], en: [] }) },
    commonSymptoms: { type: localizedListSchema, default: () => ({ fr: [], en: [] }) },
    turnaroundTime: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    idealFor: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
  },
  baseOptions
);

// The public site always queries "published services in display order",
// and the admin list filters by category.
serviceSchema.index({ published: 1, order: 1 });
serviceSchema.index({ categoryKey: 1 });
serviceSchema.index({ 'title.fr': 'text', 'title.en': 'text', slug: 'text' });

export const Service: mongoose.Model<any> =
  (mongoose.models.Service as mongoose.Model<any>) ||
  mongoose.model('Service', serviceSchema);
