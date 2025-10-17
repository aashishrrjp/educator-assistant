import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import axios from 'axios';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

// ✨ NEW: A detailed system instruction to guide the AI's persona and response format.
const systemInstruction = {
  parts: [{
    text: `You are 'SetuNova AI Tutor', a friendly and professional academic assistant for students. Your goal is to provide clear, structured, and helpful explanations.
1.  **Be Professional and Encouraging:** Maintain a positive and supportive tone. Address the student directly.
2.  **Structure Your Answers:** Always use Markdown for clear formatting. Use headings, bold text, lists, and tables to organize information logically.
3.  **Explain Step-by-Step:** When solving problems or explaining complex concepts, break them down into simple, logical steps.
4.  **Use Analogies:** Where appropriate, use simple analogies to explain complex topics (e.g., electricity as water flow).
5.  **Be Action-Oriented:** When giving advice (like study tips), provide concrete, actionable steps the student can take.
6.  **Use LaTeX for Math/Science:** Enclose ALL mathematical formulas, equations, chemical formulas, and scientific notations in LaTeX delimiters. Use $$...$$ for block equations and $...$ for inline equations.
Special note- Dont include any messages like ofcourse i can help you, etc. Just provide the response directly without any markdown display for making table, etc.
  `}]
};

// Function to call the Gemini text model
async function generateText(contents: any[]) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = { 
    contents,
    systemInstruction, // ✨ ADDED: The system instructions are now part of the payload
  };

  const response = await axios.post(apiUrl, payload);
  const candidate = response.data.candidates?.[0];
  if (candidate && candidate.content?.parts?.[0]?.text) {
    return candidate.content.parts[0].text;
  }
  return "I'm sorry, I couldn't generate a text response at this moment.";
}

// Function to call the Imagen image model
async function generateImage(prompt: string) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
  const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
  const response = await axios.post(apiUrl, payload);
  const prediction = response.data.predictions?.[0];
  if (prediction && prediction.bytesBase64Encoded) {
    return `data:image/png;base64,${prediction.bytesBase64Encoded}`;
  }
  return null;
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
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'A message is required.' });
    }

    const contents = [
      ...history.map((msg: { role: string, content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const imageKeywords = ['draw', 'diagram', 'illustrate', 'show me a picture', 'visualize'];
    const requestsImage = imageKeywords.some(keyword => message.toLowerCase().includes(keyword));

    const [textReply, imageUrl] = await Promise.all([
      generateText(contents),
      requestsImage ? generateImage(message) : Promise.resolve(null)
    ]);

    res.status(200).json({ reply: textReply, imageUrl });

  } catch (error: any) {
    console.error('AI Tutor API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get a response from the AI tutor.' });
  }
}

