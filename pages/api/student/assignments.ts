import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        studentId: userId,
      },
      orderBy: {
        dueDate: 'asc', // Show assignments due soonest first
      },
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
}