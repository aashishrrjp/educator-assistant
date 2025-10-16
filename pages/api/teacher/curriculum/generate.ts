import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/dbConnect';
import FormData from 'form-data';
import { getAuthPayload } from '../../auth'; // Ensure this path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth || auth.role !== 'TEACHER') {
    return res.status(401).json({ message: 'Authentication required or not a teacher' });
  }

  try {
    const { subject, grade, topic, duration } = req.body;

    if (!subject || !grade || !topic) {
        return res.status(400).json({ message: 'Subject, grade, and topic are required.' });
    }

    // --- FIX: Prepare the data as multipart/form-data ---
    const formData = new FormData();
    formData.append('target_class', grade);
    formData.append('subject', subject);
    formData.append('topics', topic);
    
    // Call the external Python API
    const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/curriculum/generate';
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      body: formData as any,
      // IMPORTANT: Do NOT manually set a 'Content-Type' header.
      // 'fetch' will automatically set it to 'multipart/form-data' with the correct boundary when using a FormData object.
    });

    if (!response.ok) {
      console.error('External API Error:', await response.text());
      throw new Error(`External API failed with status ${response.status}`);
    }
    const data = await response.json();

    // Save the generated curriculum to your database
    const newCurriculum = await prisma.curriculum.create({
      data: {
        title: `${topic} - ${subject}`,
        subject,
        grade,
        duration,
        content: data.curriculum,
        teacherId: auth.userId,
      },
    });

    res.status(201).json(newCurriculum);
  } catch (error) {
    console.error('Curriculum generation error:', error);
    res.status(500).json({ message: 'Failed to generate curriculum' });
  }
}