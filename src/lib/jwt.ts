import { SignJWT, jwtVerify } from 'jose';

/**
 * Edge-safe JWT helpers only - no Mongoose/bcrypt imports here. This file is
 * imported by proxy.ts, which runs on the Edge runtime and cannot bundle
 * Node-only modules like Mongoose. Node-side auth logic (login, password
 * hashing) lives in services/auth.service.ts instead.
 */
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set.');
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminSessionPayload {
  adminId: string;
  email: string;
}

export const SESSION_COOKIE_NAME = 'akr_session';
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

export async function signSessionToken(
  payload: AdminSessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);
}

export async function verifySessionToken(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (
      typeof payload.adminId !== 'string' ||
      typeof payload.email !== 'string'
    )
      return null;
    return { adminId: payload.adminId, email: payload.email };
  } catch {
    return null;
  }
}
