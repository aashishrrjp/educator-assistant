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
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // 1. Fetch all relevant data for the student in parallel
    const [assignments, quizzes, submissions] = await Promise.all([
      prisma.assignment.findMany({ where: { studentId } }),
      prisma.quiz.findMany({ where: { className: student.className || '' } }),
      prisma.quizSubmission.findMany({ where: { studentId } }),
    ]);

    // 2. Unify assignments and quizzes into a single list for easier processing
    const submissionMap = new Map(submissions.map(s => [s.quizId, s]));
    const unifiedItems = [
      ...assignments.map(a => ({ ...a, type: 'assignment' as const })),
      ...quizzes.map(q => {
        const submission = submissionMap.get(q.id);
        return {
          id: q.id,
          title: q.title,
          subject: q.subject,
          description: `${(q.questions as any[]).length} questions`,
          dueDate: q.createdAt, // Use createdAt as a proxy for dueDate for quizzes
          status: submission ? 'COMPLETED' : 'PENDING',
          score: submission?.score,
          totalPoints: submission?.totalPoints,
          type: 'quiz' as const,
        };
      }),
    ];

    // 3. Calculate statistics for the top cards
    const pending = unifiedItems.filter(item => item.status === 'PENDING');
    const completed = unifiedItems.filter(item => item.status !== 'PENDING' && item.score != null);
    
    let totalScore = 0;
    let totalMaxPoints = 0;
    completed.forEach(item => {
      totalScore += item.score || 0;
      totalMaxPoints += item.totalPoints || 0;
    });
    const avgScore = totalMaxPoints > 0 ? Math.round((totalScore / totalMaxPoints) * 100) : 0;
    
    // 4. Calculate average score per subject for the progress bars
    const subjects: { [key: string]: { score: number; total: number } } = {};
    completed.forEach(item => {
      if (!subjects[item.subject]) {
        subjects[item.subject] = { score: 0, total: 0 };
      }
      subjects[item.subject].score += item.score || 0;
      subjects[item.subject].total += item.totalPoints || 0;
    });
    const subjectProgress = Object.keys(subjects).map(subject => ({
      name: subject,
      avg: subjects[subject].total > 0 ? Math.round((subjects[subject].score / subjects[subject].total) * 100) : 0,
    }));

    // 5. Assemble the final payload for the dashboard
    const dashboardData = {
      studentName: student.name,
      stats: {
        activeAssignments: pending.length,
        completedAssignments: completed.length,
        avgScore: avgScore,
      },
      // Get the 3 most urgent pending assignments
      pendingAssignments: pending.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3),
      // Get the 4 most recently graded assignments
      recentGrades: completed.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 4),
      subjectProgress,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Failed to fetch student dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch student dashboard data' });
  }
}

