import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import FormData from 'form-data';
import axios from 'axios'; // Import axios

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
    
    const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/curriculum/generate';
    
    // --- THE FIX: Using axios to reliably send multipart/form-data ---
    const response = await axios.post(externalApiUrl, formData, {
      headers: {
        ...formData.getHeaders(), // Axios can correctly get the headers from the form-data object
      },
    });
    
    const aiData = response.data;

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
    // Axios provides detailed error information
    if (axios.isAxiosError(error) && error.response) {
      console.error('External FastAPI Error:', error.response.data);
      return res.status(error.response.status).json({ message: `AI service failed.`, details: error.response.data });
    }
    console.error('Curriculum generation error:', error);
    res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}
