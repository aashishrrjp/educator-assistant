import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Helper function to verify JWT and get user ID (can be shared)
async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // === HANDLE FETCHING STUDENT PROFILE DATA (GET) ===
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        // Select fields relevant to the student
        select: {
          name: true,
          email: true,
          school: true,
          grade: true, // Student-specific field
          phone: true,
          bio: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Failed to fetch student profile:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // === HANDLE UPDATING STUDENT PROFILE DATA (PUT) ===
  if (req.method === 'PUT') {
    try {
      const profileData = req.body;

      // Security: Prevent sensitive fields from being updated via this endpoint
      delete profileData.email;
      delete profileData.role;
      delete profileData.password;
      delete profileData.subjects; // Ensure teacher fields can't be added

      await prisma.user.update({
        where: { id: userId },
        data: profileData,
      });

      return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Failed to update student profile:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: `Method ${req.method} is not allowed` });
}