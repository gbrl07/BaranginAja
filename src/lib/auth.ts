import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export interface UserSession {
  id: string;
  email: string;
  role: string;
  nama_lengkap: string;
  is_seller: boolean;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }
  if (!allowedRoles.includes(session.role)) {
    redirect('/');
  }
  return session;
}
