import mongoose, { Schema } from 'mongoose';
import { baseOptions, localizedSchema } from './shared.ts';

/**
 * Media library. Images and videos are stored as separate `kind` values so the
 * admin never mixes product/service imagery with video assets.
 */
const mediaSchema = new Schema(
  {
    title: { type: String, default: '', trim: true },
    kind: { type: String, enum: ['image', 'video'], default: 'image', index: true },
    url: { type: String, required: true, trim: true },
    provider: { type: String, enum: ['cloudinary', 'external'], default: 'external' },
    publicId: { type: String, default: '', trim: true },
    format: { type: String, default: '', trim: true },
    bytes: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    alt: { type: localizedSchema, default: () => ({ fr: '', en: '' }) },
  },
  baseOptions
);

mediaSchema.index({ kind: 1, createdAt: -1 });

export const Media: mongoose.Model<any> =
  (mongoose.models.Media as mongoose.Model<any>) ||
  mongoose.model('Media', mediaSchema);
