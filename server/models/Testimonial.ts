import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

const testimonialSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    vehicle: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    serviceCategory: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    content: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    date: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    verified: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  baseOptions
);

testimonialSchema.index({ published: 1, order: 1 });

export const Testimonial: mongoose.Model<any> =
  (mongoose.models.Testimonial as mongoose.Model<any>) ||
  mongoose.model('Testimonial', testimonialSchema);
