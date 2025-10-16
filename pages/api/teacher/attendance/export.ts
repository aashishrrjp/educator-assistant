import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import { UserRole } from '@prisma/client';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { className, date } = req.query;
    if (!className || !date || typeof className !== 'string' || typeof date !== 'string') {
      return res.status(400).json({ message: 'Class name and date are required.' });
    }

    // Fetch only the students who were PRESENT or LATE on the specified date
    const attendanceDate = new Date(date);
    const records = await prisma.attendance.findMany({
      where: {
        className,
        date: attendanceDate,
        status: { in: ['PRESENT', 'LATE'] }, // Filter for present/late students
      },
      include: {
        student: {
          select: { name: true, rollNo: true },
        },
      },
      orderBy: {
        student: { rollNo: 'asc' },
      },
    });

    // --- Generate CSV Content ---
    const headers = 'Roll No,Name,Status';
    const csvRows = records.map(record => 
      `${record.student.rollNo},${record.student.name},${record.status}`
    );
    const csvString = [headers, ...csvRows].join('\n');

    // --- Set HTTP Headers to Trigger Download ---
    const fileName = `attendance-${className}-${date}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send the CSV string as the response
    res.status(200).send(csvString);

  } catch (error) {
    console.error('Failed to export attendance:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}