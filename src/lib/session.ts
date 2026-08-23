import { cookies } from 'next/headers';
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
  type AdminSessionPayload,
} from '@/lib/jwt';

/** Reads and verifies the current admin session from the request cookies. Returns null if absent/invalid/expired. */
export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
