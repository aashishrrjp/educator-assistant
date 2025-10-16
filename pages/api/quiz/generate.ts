// File: pages/api/quiz/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify, JWTPayload } from 'jose';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Ensure your JWT_SECRET is in your .env.local file
if (!process.env.JWT_SECRET) {
  throw new Error("Missing environment variable JWT_SECRET");
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Verifies the JWT from cookies and returns the payload.
 */
async function getJwtPayload(req: NextApiRequest): Promise<JWTPayload | null> {
  const token = req.cookies.auth_token;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

/**
 * Extracts a JSON object from a string, cleaning up common LLM artifacts.
 */
function extractJsonFromString(text: string): any {
  const jsonMatch = text.match(/(\[.*\]|\{.*\})/s);
  if (!jsonMatch) {
    console.error("No valid JSON object or array found in the AI response string.");
    return null;
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse the extracted JSON string:", error);
    return null;
  }
}

// Main handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = await getJwtPayload(req);
  if (!payload || !payload.userId) {
    return res.status(401).json({ message: 'Authentication required or token is invalid.' });
  }
  const userId = payload.userId as string;

  // Handle GET request to fetch quizzes
  if (req.method === 'GET') {
    try {
      const quizzes = await prisma.quiz.findMany({
        where: { teacherId: userId },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return res.status(500).json({ message: 'Failed to fetch quizzes.' });
    }
  }

  // Handle POST requests for both AI generation and saving quizzes
  if (req.method === 'POST') {
    // Differentiate between AI generation and saving a quiz
    // AI generation request will have `quiz_type` and `topics`
    if (req.body.quiz_type && req.body.topics) {
      // AI Generation Logic
      try {
        const { quiz_type, total_questions, subject, difficulty, topics } = req.body;
        const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/quiz/generate';
        
        const apiResponse = await fetch(externalApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
          body: JSON.stringify({ quiz_type, total_questions, subject, difficulty, topics }),
        });

        const responseData = await apiResponse.json();
        if (!apiResponse.ok) throw new Error(responseData.detail || 'AI service failed');

        const rawContent = responseData.quiz_content;
        if (typeof rawContent !== 'string') throw new Error('Expected a JSON string from AI service');
        
        const aiJson = extractJsonFromString(rawContent);
        if (!aiJson || !Array.isArray(aiJson.questions)) throw new Error('Malformed quiz content from AI');

        const transformedQuestions = aiJson.questions.map((q: any) => {
          const correctIndex = q.options.indexOf(q.correct_answer);
          return {
            text: q.question_text,
            options: q.options,
            correct: correctIndex !== -1 ? correctIndex : 0,
          };
        });
        return res.status(200).json(transformedQuestions);
      } catch (error: any) {
        console.error("Error in AI quiz generation handler:", error);
        return res.status(500).json({ message: error.message || 'An internal server error occurred during AI generation.' });
      }
    } else {
      // Save Quiz Logic
      try {
        const { title, subject, className, questions } = req.body;

        if (!title || !subject || !className || !questions) {
          return res.status(400).json({ message: 'Missing required fields to save quiz.' });
        }

        const newQuiz = await prisma.quiz.create({
          data: {
            title,
            subject,
            className,
            questions: questions as Prisma.JsonArray, // Cast questions to the expected JSON type
            teacherId: userId,
          },
        });
        return res.status(201).json(newQuiz);
      } catch (error) {
        console.error("Error saving quiz:", error);
        return res.status(500).json({ message: 'An internal server error occurred while saving the quiz.' });
      }
    }
  }

  // Handle other methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}