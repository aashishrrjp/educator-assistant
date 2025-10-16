// File: pages/api/teacher/quiz/results.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// This function verifies the teacher's token
async function verifyTeacherToken(req: NextApiRequest): Promise<boolean> {
  const token = req.cookies.auth_token;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'TEACHER'; // Ensure the user is a teacher
  } catch (error) {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const isTeacher = await verifyTeacherToken(req);
  if (!isTeacher) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { quizId } = req.query;

  if (!quizId || typeof quizId !== 'string') {
    return res.status(400).json({ message: 'Quiz ID is required.' });
  }

  try {
    // Fetch all submissions for the given quizId
    // and include the related student's name and email
    const submissions = await prisma.quizSubmission.findMany({
      where: {
        quizId: quizId,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Failed to fetch quiz results:', error);
    res.status(500).json({ message: 'Failed to fetch quiz results' });
  }
}