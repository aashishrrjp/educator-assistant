import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import FormData from 'form-data';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getAuthPayload(req: NextApiRequest) {
  const token = req.cookies.auth_token;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required or not a teacher.' });
  }

  try {
    const { subject, grade, topic, duration } = req.body;

    if (!subject || !grade || !topic) {
        return res.status(400).json({ message: 'Subject, grade, and topic are required fields.' });
    }

    const formData = new FormData();
    formData.append('target_class', grade);
    formData.append('subject', subject);
    formData.append('topics', topic);
    if (process.env.NODE_ENV === 'development') {
      console.log('FormData entries:');
      (formData as any)._streams.forEach((stream: any, index: number) => { if (index % 2 === 0) console.log(stream); });
    }
    
    const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/curriculum/generate';
    
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      body: formData as any,
      // NOTE: We do NOT set the 'Content-Type' header manually.
      // The 'fetch' API automatically sets the correct multipart header with the boundary.
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External FastAPI Error:', errorText);
      return res.status(response.status).json({ message: `AI service failed. Details: ${errorText}` });
    }
    
    const aiData = await response.json();

    const newCurriculum = await prisma.curriculum.create({
      data: {
        title: `${topic} - ${subject}`,
        subject,
        grade,
        duration,
        content: aiData.curriculum,
        teacherId: auth.userId,
      },
    });

    res.status(201).json(newCurriculum);
  } catch (error: any) {
    console.error('Curriculum generation error:', error);
    res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}
