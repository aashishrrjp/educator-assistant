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

  const studentId = await getUserIdFromToken(req);
  if (!studentId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: studentId } });
    if (!user || !user.className) {
      return res.status(200).json([]);
    }

    // Fetch assignments, quizzes, submissions, AND activities in parallel
    const [assignments, quizzes, submissions, activities] = await Promise.all([
      prisma.assignment.findMany({ where: { studentId }, orderBy: { dueDate: 'asc' } }),
      prisma.quiz.findMany({ where: { className: user.className }, orderBy: { createdAt: 'desc' } }),
      prisma.quizSubmission.findMany({ where: { studentId } }),
      prisma.activity.findMany({ where: { className: user.className }, orderBy: { createdAt: 'desc' } }),
    ]);

    const submissionMap = new Map(submissions.map(s => [s.quizId, s]));

    const formattedQuizzes = quizzes.map(quiz => {
      const submission = submissionMap.get(quiz.id);
      return {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        description: `${(quiz.questions as any[]).length} multiple-choice questions.`,
        dueDate: quiz.createdAt.toISOString(),
        status: submission ? 'COMPLETED' : 'PENDING',
        score: submission?.score,
        totalPoints: submission?.totalPoints,
        type: 'quiz' as const,
        questions: quiz.questions,
        studentAnswers: submission?.answers, // Include student's answers for review
      };
    });
    
    // Format activities to match the unified structure
    const formattedActivities = activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        subject: 'Interactive',
        description: activity.description,
        dueDate: activity.createdAt.toISOString(),
        status: 'PENDING' as const, // Activities are always pending interaction
        type: 'activity' as const,
        url: activity.url,
    }));

    const formattedAssignments = assignments.map(a => ({
      ...a,
      type: 'assignment' as const,
      dueDate: a.dueDate.toISOString()
    }));

    // Combine all three types of tasks
    const combined = [...formattedAssignments, ...formattedQuizzes, ...formattedActivities].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    res.status(200).json(combined);
  } catch (error) {
    console.error('Failed to fetch assignments and activities:', error);
    res.status(500).json({ message: 'Failed to fetch assignments and activities' });
  }
}

