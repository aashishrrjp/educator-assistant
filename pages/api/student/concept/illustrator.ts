import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import axios from 'axios';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Make sure to add your Gemini API key to .env.local

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

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Server configuration error: Missing API Key.' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'A prompt is required to generate an image.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`;
    
    // Payload for the generateContent method
    const payload = {
      contents: [{
          parts: [{ text: prompt }]
      }],
      generationConfig: {
          responseModalities: ['IMAGE']
      },
    };

    const response = await axios.post(apiUrl, payload);

    const base64Data = response.data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

    if (base64Data) {
      const imageUrl = `data:image/png;base64,${base64Data}`;
      res.status(200).json({ imageUrl });
    } else {
      console.error("Invalid response structure from Gemini:", response.data);
      throw new Error('Image generation failed or returned an invalid format.');
    }

  } catch (error: any) {
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate concept image.' });
  }
}

