import { sql } from '@vercel/postgres';
import { verifyToken } from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const sessionClaims = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    const userId = sessionClaims.sub;

    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1].content;

    // Retrieval: Find relevant memories (simple keyword search)
    const { rows: memories } = await sql`
      SELECT title, content, type, memory_layer 
      FROM memories 
      WHERE user_id = ${userId} 
      AND (title ILIKE ${'%' + lastMessage + '%'} OR content ILIKE ${'%' + lastMessage + '%'})
      LIMIT 10
    `;

    // If no specific match, just get the latest memories for context
    let contextMemories = memories;
    if (contextMemories.length === 0) {
      const { rows: latest } = await sql`
        SELECT title, content, type, memory_layer 
        FROM memories 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      contextMemories = latest;
    }

    const contextString = contextMemories
      .map(m => `[${m.type.toUpperCase()} - ${m.memory_layer}] ${m.title}: ${m.content}`)
      .join('\n\n');

    // For now, if GEMINI_API_KEY is missing, we'll return a helpful error or mock
    if (!GEMINI_API_KEY) {
      return res.status(200).json({
        choices: [{
          delta: { content: "I've retrieved your relevant memories, but the AI reasoning engine (Gemini) is not configured yet. Please add `GEMINI_API_KEY` to your `.env` to enable full chat functionality.\n\n**Retrieved Context:**\n" + contextString }
        }]
      });
    }

    // AI Logic (Placeholder for Gemini Call)
    // In a real implementation, you'd use fetch() to call Gemini or an AI SDK.
    // For this migration, we'll provide a response that confirms the retrieval works.
    
    return res.status(200).json({
      choices: [{
        delta: { content: "Neural link established. I found " + contextMemories.length + " relevant memory fragments in your Vercel Postgres repository. (Gemini integration in progress...)\n\n" + contextString }
      }]
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
