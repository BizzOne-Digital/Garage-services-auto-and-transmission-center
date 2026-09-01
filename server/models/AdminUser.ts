import mongoose, { Schema } from 'mongoose';
import { baseOptions } from './shared.ts';

export interface AdminUserDoc extends mongoose.Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin';
  lastLoginAt: Date | null;
}

const adminUserSchema = new Schema<AdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Never selected by default so it cannot leak through a generic query.
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: 'Administrator', trim: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    lastLoginAt: { type: Date, default: null },
  },
  baseOptions
);

export const AdminUser =
  (mongoose.models.AdminUser as mongoose.Model<AdminUserDoc>) ||
  mongoose.model<AdminUserDoc>('AdminUser', adminUserSchema);
