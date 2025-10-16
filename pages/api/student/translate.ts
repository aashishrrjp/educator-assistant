import { NextApiRequest, NextApiResponse } from 'next';
import { v2 } from '@google-cloud/translate';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Initialize the Google Translate client
const translateClient = new v2.Translate();

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

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'Text and target language are required.' });
    }

    // Use the Google Translate API
    const [translation] = await translateClient.translate(text, targetLanguage);

    res.status(200).json({ translatedText: translation });
  } catch (error) {
    console.error('Translation API Error:', error);
    res.status(500).json({ message: 'Failed to translate text.' });
  }
}