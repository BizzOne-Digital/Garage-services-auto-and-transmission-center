import mongoose, { Schema } from 'mongoose';
import { baseOptions } from './shared.ts';

/** Quote requests captured from the public contact form and quote modal. */
const leadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    vehicleMakeModel: { type: String, default: '', trim: true },
    vehicleYear: { type: String, default: '', trim: true },
    serviceNeeded: { type: String, default: '', trim: true },
    transmissionType: { type: String, default: '', trim: true },
    urgency: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },

    source: { type: String, enum: ['contact-form', 'quote-modal'], default: 'contact-form' },
    language: { type: String, enum: ['fr', 'en'], default: 'fr' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
      default: 'new',
    },
    notes: { type: String, default: '', trim: true },
  },
  baseOptions
);

// The admin inbox is always "newest first", optionally filtered by status.
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });

export const Lead: mongoose.Model<any> =
  (mongoose.models.Lead as mongoose.Model<any>) ||
  mongoose.model('Lead', leadSchema);
