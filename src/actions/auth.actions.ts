'use server';

import { cookies } from 'next/headers';
import {
  login as loginService,
  InvalidCredentialsError,
} from '@/services/auth.service';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/jwt';

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  try {
    const { token } = await loginService(email, password);
    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return { success: true };
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return { error: 'Incorrect email or password. Please try again.' };
    }
    // Never leak internal error details (DB connection strings, stack traces) to the client.
    console.error('Login error:', err);
    return { error: 'Something went wrong. Please try again in a moment.' };
  }
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
