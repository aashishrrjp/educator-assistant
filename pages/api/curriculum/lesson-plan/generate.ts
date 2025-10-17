import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import { jwtVerify } from 'jose';
import axios from 'axios';

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
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // The frontend sends the curriculumId. We don't need the other fields for the AI call.
    const { curriculumId } = req.body;

    if (!curriculumId) {
        return res.status(400).json({ message: 'Missing curriculumId for lesson plan generation.' });
    }

    const curriculum = await prisma.curriculum.findUnique({
      where: { id: curriculumId },
      include: { lessonPlan: true }
    });

    if (!curriculum) {
      return res.status(404).json({ message: 'Curriculum not found' });
    }
    
    // If a plan already exists, we can just return it without calling the AI again.
    if (curriculum.lessonPlan) {
        return res.status(200).json(curriculum.lessonPlan);
    }

    const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/lesson-plan/generate';
    
    // --- THE CRITICAL FIX ---
    // The FastAPI endpoint expects `target_class` and `subject`.
    // We will extract these from the curriculum we fetched from our database.
    
    // Attempt to parse a number from the grade string (e.g., "10th Grade" -> 10)
    const gradeNumber = parseInt(curriculum.grade.match(/\d+/)?.[0] || '0', 10);

    const response = await axios.post(externalApiUrl, {
      target_class: gradeNumber,
      subject: curriculum.subject,
    });
    
    const aiData = response.data;

    // Save the new lesson plan to our own database
    const newLessonPlan = await prisma.lessonPlan.create({
      data: {
        title: `Lesson Plan for ${curriculum.title}`,
        content: aiData.lesson_plan,
        teacherId: auth.userId,
        curriculumId: curriculum.id,
      },
    });

    res.status(201).json(newLessonPlan);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('External FastAPI Error:', error.response.data);
      return res.status(error.response.status).json({ message: `AI service failed.`, details: error.response.data });
    }
    console.error('Lesson plan generation error:', error);
    res.status(500).json({ message: 'Failed to generate lesson plan' });
  }
}

