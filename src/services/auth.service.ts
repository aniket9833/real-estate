import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { Admin } from '@/models/Admin';
import { signSessionToken, type AdminSessionPayload } from '@/lib/jwt';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password.');
  }
}

/**
 * Node-only: touches Mongoose and bcrypt. Import this only from Server
 * Actions / Route Handlers (Node runtime) - never from proxy.ts, which
 * runs on the Edge runtime and cannot bundle these modules. For session
 * verification in proxy, import verifySessionToken from "@/lib/jwt"
 * directly instead.
 */
export async function login(
  email: string,
  password: string,
): Promise<{ token: string; admin: AdminSessionPayload }> {
  await connectDB();

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) throw new InvalidCredentialsError();

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new InvalidCredentialsError();

  admin.lastLoginAt = new Date();
  await admin.save();

  const payload: AdminSessionPayload = {
    adminId: admin._id.toString(),
    email: admin.email,
  };
  const token = await signSessionToken(payload);

  return { token, admin: payload };
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
