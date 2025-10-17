import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import axios from 'axios';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Helper to get user ID from token
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

// Helper to map language code to full name for a clearer AI prompt
const getLanguageName = (code: string): string => {
    const languageMap: { [key: string]: string } = {
        'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu', 'mr': 'Marathi',
        'ta': 'Tamil', 'gu': 'Gujarati', 'kn': 'Kannada', 'ml': 'Malayalam',
        'pa': 'Punjabi', 'en': 'English',
    };
    return languageMap[code] || code;
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
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'Text and target language are required.' });
    }

    const languageName = getLanguageName(targetLanguage);
    const prompt = `Translate the following text to ${languageName}. Only return the translated text, with no additional explanation or introductory phrases:\n\n"${text}"`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await axios.post(apiUrl, payload);
    const candidate = response.data.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      const translatedText = candidate.content.parts[0].text;
      res.status(200).json({ translatedText });
    } else {
      throw new Error('Translation failed or returned an invalid format.');
    }

  } catch (error: any) {
    console.error('Translation API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to translate the text.' });
  }
}
