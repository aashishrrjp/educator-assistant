import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import { UserRole, AttendanceStatus } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAuthPayload(req: NextApiRequest): Promise<{ userId: string; role: UserRole } | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string, role: payload.role as UserRole };
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required or not a teacher' });
  }

  // === HANDLE FETCHING ATTENDANCE DATA ===
  if (req.method === 'GET') {
    try {
      const { className, date } = req.query;
      if (!className || !date || typeof className !== 'string' || typeof date !== 'string') {
        return res.status(400).json({ message: 'Class name and date are required.' });
      }

      // 1. Find all students in the specified class
      const students = await prisma.user.findMany({
        where: { className, role: 'STUDENT' },
        select: { id: true, name: true, rollNo: true },
        orderBy: { rollNo: 'asc' },
      });

      // 2. Find existing attendance records for these students on the given date
      const attendanceDate = new Date(date);
      const records = await prisma.attendance.findMany({
        where: {
          studentId: { in: students.map(s => s.id) },
          date: attendanceDate,
        },
      });

      // 3. Combine student list with their attendance status
      const attendanceMap = new Map(records.map(r => [r.studentId, r.status]));
      const responseData = students.map(student => ({
        ...student,
        // Default to ABSENT if no record is found for that day, forcing a choice
        status: attendanceMap.get(student.id) || 'ABSENT',
      }));

      return res.status(200).json(responseData);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // === HANDLE SAVING ATTENDANCE DATA ===
  if (req.method === 'POST') {
    try {
      const { className, date, attendance } = req.body;
      if (!className || !date || !attendance) {
        return res.status(400).json({ message: 'Class name, date, and attendance data are required.' });
      }

      const attendanceDate = new Date(date);
      const teacherId = auth.userId;

      // Use a transaction to perform all updates/creations at once
      const transactions = Object.entries(attendance).map(([studentId, status]) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId, date: attendanceDate } },
          update: { status: status as AttendanceStatus },
          create: {
            studentId,
            teacherId,
            date: attendanceDate,
            className,
            status: status as AttendanceStatus,
          },
        })
      );
      
      await prisma.$transaction(transactions);

      return res.status(200).json({ message: 'Attendance saved successfully' });
    } catch (error) {
      console.error('Failed to save attendance:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}