// File: pages/api/quiz/generate.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

// Ensure your JWT_SECRET is in your .env.local file
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Verifies the JWT from cookies and returns the user ID.
 */
async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  // The cookie name 'auth_token' must match what you set during login
  const token = req.cookies.auth_token;
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}

// Main handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint only accepts POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 1. Authenticate the user via the token in the cookie
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  try {
    // 2. Get the parameters from the request body
    const { quiz_type, total_questions, subject, difficulty, topics } = req.body;

    // 3. Call your external FastAPI service
    // Make sure your FastAPI server is running!
    const externalApiUrl = 'http://127.0.0.1:8000/api/v1/teacher/quiz/generate'; 
    
    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        quiz_type,
        total_questions,
        subject,
        difficulty,
        topics,
      }),
    });

    if (!apiResponse.ok) {
      // If the external API fails, forward the error
      return res.status(apiResponse.status).json({ message: 'Failed to generate quiz from AI service.' });
    }

    const data = await apiResponse.json();

    // 4. The FastAPI response has a stringified JSON inside `quiz_content`. We need to parse it.
    const generatedQuiz = JSON.parse(data.quiz_content);
    
    // 5. Send the parsed quiz content back to the client
    return res.status(200).json(generatedQuiz);

  } catch (error) {
    console.error("Error in quiz generation handler:", error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}