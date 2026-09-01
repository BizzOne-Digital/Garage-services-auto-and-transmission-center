import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

const faqSchema = new Schema(
  {
    question: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    answer: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  baseOptions
);

faqSchema.index({ published: 1, order: 1 });

export const Faq: mongoose.Model<any> =
  (mongoose.models.Faq as mongoose.Model<any>) ||
  mongoose.model('Faq', faqSchema);
