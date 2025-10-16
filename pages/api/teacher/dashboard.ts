// File: pages/api/teacher/dashboard.ts
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

  const teacherId = await getUserIdFromToken(req);
  if (!teacherId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // 1. Fetch core teacher data and related items in parallel
    const [teacher, quizzes, recentSubmissions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: teacherId },
      }),
      prisma.quiz.findMany({
        where: { teacherId },
        include: { _count: { select: { submissions: true } } },
      }),
      prisma.quizSubmission.findFirst({ // Get the single most recent submission
        where: { quiz: { teacherId } },
        orderBy: { submittedAt: 'desc' },
        include: { quiz: { select: { title: true } }, student: {select: {name: true}} },
      }),
    ]);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const teacherClasses = teacher.classesTaught || [];

    // 2. Fetch data that depends on the teacher's classes
    const [totalStudents, attendanceRecords, classesOverviewData] = await Promise.all([
      prisma.user.count({
        where: { role: 'STUDENT', className: { in: teacherClasses } },
      }),
      prisma.attendance.findMany({
        where: { teacherId },
      }),
      Promise.all(
        teacherClasses.map(async (className) => {
          const studentCount = await prisma.user.count({ where: { className } });
          const subject = quizzes.find(q => q.className === className)?.subject || teacher.subjects[0] || 'N/A';
          return { name: className, studentCount, subject, progress: Math.floor(Math.random() * 30) + 60 };
        })
      ),
    ]);

    // 3. Calculate statistics
    const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const avgAttendance = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
    
    // 4. Build Recent Activity (simplified for demonstration)
    const recentActivity = [];
    if (recentSubmissions) {
      recentActivity.push({
        type: 'Quiz Submission',
        description: `${recentSubmissions.student.name} completed "${recentSubmissions.quiz.title}"`,
        time: recentSubmissions.submittedAt,
      });
    }
    const latestQuiz = quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestQuiz) {
        recentActivity.push({
            type: 'Quiz Created',
            description: `You created the quiz "${latestQuiz.title}"`,
            time: latestQuiz.createdAt,
        });
    }

    // 5. Assemble the final dashboard payload
    const dashboardData = {
      teacherName: teacher.name,
      stats: {
        totalStudents,
        totalClasses: teacherClasses.length,
        activeQuizzes: quizzes.length,
        avgAttendance,
      },
      classesOverview: classesOverviewData,
      recentActivity,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
}