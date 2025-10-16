import { NextApiRequest } from 'next';
import { jwtVerify } from 'jose';
import { UserRole } from '@prisma/client';

// This MUST match the secret from your sign-in API
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key-that-is-at-least-32-chars-long');
const COOKIE_NAME = 'auth_token';

/**
 * Reads and verifies the JWT cookie from a request to get the user's ID and role.
 */
export async function getAuthPayload(req: NextApiRequest): Promise<{ userId: string; role: UserRole } | null> {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as UserRole,
    };
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}