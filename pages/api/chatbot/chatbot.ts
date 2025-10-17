import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

// This should be in a shared helper file, but is here for simplicity
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

// The fixed system instruction for your agent
const systemInstruction = {
  parts: [{
    text: "You are 'Setunova', an agentic AI assistant for teachers. Your primary role is to understand a user's request in natural language and use the appropriate tool to fulfill it.\n\n1.  **Analyze the user's message** to determine their intent and which tool they need.\n2.  **Extract all relevant parameters** for that tool from the conversation history and the latest message.\n3.  **Check for completeness.** If you have enough information, proceed to generate the response.\n4.  **Ask for clarification.** If information is missing, ask a clear, friendly follow-up question. Do not try to guess missing information.\n5.  **Be conversational.** Maintain a helpful and professional tone.\n6.  **Format your final outputs** using markdown for readability (e.g., using lists, bold text, and tables)."
  }],
  role: "user" // As per your payload structure
};

// The generation configuration for your agent, including the full schema
const generationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "OBJECT",
    properties: {
      tool: {
        type: "STRING",
        description: "The specific tool the user wants to use. If the intent is unclear or just a casual conversation, use 'SEARCH'.",
        enum: ["Curriculum Designer", "Lesson Plan Generator", "Timetable Generator", "Quiz Generator", "Activity Designer", "Resource Finder", "SEARCH"],
      },
      isRequestComplete: {
        type: "BOOLEAN",
        description: "Set to true if all necessary information to use the tool is present. Set to false if information is missing.",
      },
      params: {
        type: "OBJECT",
        description: "Extracted parameters for the selected tool.",
        properties: {
          className: { type: "STRING", description: "The grade or class level (e.g., 'Grade 10')." },
          activityType: { type: "STRING", enum: ["Group", "Individual"] },
          difficulty: { type: "STRING", enum: ["Easy", "Medium", "Hard"] },
          numClasses: { type: "INTEGER", description: "Number of classes for a timetable." },
          numQuestions: { type: "INTEGER", description: "Number of questions for a quiz." },
          query: { type: "STRING", description: "The user's original query for the SEARCH tool." },
          quizType: { type: "STRING", enum: ["Objective (MCQ)", "Subjective (Open-ended)", "Both"] },
          rules: { type: "STRING", description: "Optional rules for a timetable." },
          subject: { type: "STRING", description: "The academic subject (e.g., 'Physics')." },
          topic: { type: "STRING", description: "A single topic for a lesson plan, quiz, or activity." },
          topics: { type: "STRING", description: "A comma-separated list of topics for a curriculum." },
          totalHours: { type: "INTEGER", description: "Total weekly hours for a timetable." },
        },
      },
      followUpQuestion: {
        type: "STRING",
        description: "If isRequestComplete is false, formulate a concise, friendly question for the missing information. This should be null if isRequestComplete is true.",
      },
    },
    required: ["tool", "isRequestComplete", "params"],
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const auth = await getAuthPayload(req);
  if (!auth) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Ensure you have your Gemini API key in your environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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

    const agentPayload = {
      contents,
      systemInstruction,
      generationConfig
    };
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentPayload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        throw new Error(`Gemini API responded with status ${response.status}: ${errorText}`);
    }

    const agentResponse = await response.json();

    const responseText = agentResponse.candidates[0].content.parts[0].text;
    const finalData = JSON.parse(responseText);

    res.status(200).json(finalData);

  } catch (error: any) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ message: 'An internal server error occurred.', details: error.message });
  }
}

