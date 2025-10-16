// pages/api/curriculum/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { getAuthPayload } from '../../auth'; // Adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const curriculums = await prisma.curriculum.findMany({
      where: { teacherId: auth.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(curriculums);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch curriculums' });
  }
}