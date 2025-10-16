// File: pages/api/student/quiz/submit.ts
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const studentId = await getUserIdFromToken(req);
  if (!studentId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({ message: 'Quiz ID and answers are required.' });
    }

    // 1. Fetch the original quiz to get the correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz || !Array.isArray(quiz.questions)) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // 2. Auto-grade the submission
    let score = 0;
    const questions = quiz.questions as any[];
    questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const correctAnswer = question.correct;
      if (studentAnswer === correctAnswer) {
        score++;
      }
    });

    // 3. Save the submission to the database
    const submission = await prisma.quizSubmission.create({
      data: {
        studentId,
        quizId,
        answers,
        score,
        totalPoints: questions.length,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
}