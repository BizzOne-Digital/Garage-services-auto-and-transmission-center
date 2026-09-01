import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

const trustPillarSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    iconName: { type: String, default: 'ShieldCheck', trim: true },
    title: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    subtitle: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    description: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  baseOptions
);

trustPillarSchema.index({ published: 1, order: 1 });

export const TrustPillar: mongoose.Model<any> =
  (mongoose.models.TrustPillar as mongoose.Model<any>) ||
  mongoose.model('TrustPillar', trustPillarSchema);
