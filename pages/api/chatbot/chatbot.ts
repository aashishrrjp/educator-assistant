import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import axios from 'axios';

// This should be in a shared helper file, but is here for simplicity
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

// A detailed system instruction to guide the AI's persona for teachers
const systemInstruction = {
  parts: [{
    text: `You are 'SetuNova AI Assistant', a friendly and professional AI partner for teachers. Your goal is to provide clear, structured, and helpful resources.
1.  **Be Professional and Collaborative:** Maintain a supportive and expert tone. Address the teacher as a colleague.
2.  **Structure Your Answers:** Always use Markdown for clear formatting. Use headings, bold text, lists, and tables to create professional-quality documents.
3.  **Provide Actionable Content:** When creating lesson plans, rubrics, or tips, provide concrete, actionable steps.
4.  **Use LaTeX for Math/Science:** Enclose ALL mathematical formulas, equations, chemical formulas, and scientific notations in LaTeX delimiters. Use $$...$$ for block equations and $...$ for inline equations.
5.  **Be Direct:** Do not start responses with conversational fluff like "Of course, I can help with that." Directly provide the requested information.
Special note- Dont include any messages like ofcourse i can help you, etc. Just provide the response directly without any markdown display for making table, etc.`
  }]
};

// Function to call the Gemini text model
async function generateText(contents: any[]) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = { 
    contents,
    systemInstruction,
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

  const auth = await getAuthPayload(req);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Server configuration error: Missing Gemini API Key.' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const contents = [
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    // Check for keywords that suggest an image is needed
    const imageKeywords = ['draw', 'diagram', 'illustrate', 'show me a picture', 'visualize'];
    const requestsImage = imageKeywords.some(keyword => message.toLowerCase().includes(keyword));

    // Call both text and image generation in parallel
    const [textReply, imageUrl] = await Promise.all([
      generateText(contents),
      requestsImage ? generateImage(message) : Promise.resolve(null)
    ]);

    // Return a response with both text and an optional image URL
    res.status(200).json({ reply: textReply, imageUrl });

  } catch (error: any) {
    console.error('Chatbot API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'An internal server error occurred.', details: error.message });
  }
}

