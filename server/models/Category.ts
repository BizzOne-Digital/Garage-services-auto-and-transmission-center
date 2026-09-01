import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

const categorySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions
);

categorySchema.index({ order: 1 });

export const Category: mongoose.Model<any> =
  (mongoose.models.Category as mongoose.Model<any>) ||
  mongoose.model('Category', categorySchema);
