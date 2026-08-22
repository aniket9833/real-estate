import { Schema, models, model, InferSchemaType } from 'mongoose';

/**
 * Single-owner admin account. Seeded via scripts/seed.ts, not via public
 * signup - there is intentionally no registration endpoint.
 */
const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Owner' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminDoc = InferSchemaType<typeof AdminSchema>;

export const Admin = models.Admin || model('Admin', AdminSchema);
