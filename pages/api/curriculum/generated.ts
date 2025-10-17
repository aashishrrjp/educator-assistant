import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAuthPayload(req: NextApiRequest) {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint only handles GET requests to fetch data
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Fetch all curriculums created by the logged-in teacher
    const curriculums = await prisma.curriculum.findMany({
      where: {
        teacherId: auth.userId,
      },
      include: {
        lessonPlan: true, // Include the lesson plan associated with each curriculum
      },
      orderBy: {
        createdAt: 'desc', // Show the newest ones first
      },
    });

    res.status(200).json(curriculums);
  } catch (error) {
    console.error('Failed to fetch curriculums:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
}
