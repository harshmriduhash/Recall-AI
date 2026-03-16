import { verifyToken } from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

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
    await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    
    const { title, content } = req.body;
    
    // Simple heuristic-based tag generator (Placeholder for Gemini)
    const possibleTags = ['technical', 'architecture', 'logic', 'frontend', 'backend', 'database', 'security'];
    const combined = (title + ' ' + content).toLowerCase();
    const suggested = possibleTags.filter(tag => combined.includes(tag));
    
    // Add default tags if none found
    if (suggested.length === 0) {
      suggested.push('memory', 'insight');
    }

    return res.status(200).json({ tags: suggested.slice(0, 5) });
  } catch (error: any) {
    console.error('Suggest Tags API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
