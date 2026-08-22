import { createClient } from '@supabase/supabase-js';

/**
 * SERVER-ONLY CLIENT. Uses the service-role key, which bypasses Row Level
 * Security. This file must never be imported from a "use client" component -
 * only from services, route handlers, and server actions.
 */
const url = process.env.SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY as string;

if (!url || !serviceRoleKey) {
  throw new Error('SUPABASE_URL / SUPABASE_SECRET_KEY are not set.');
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const PROPERTY_IMAGES_BUCKET =
  process.env.SUPABASE_BUCKET || 'property-images';
