import { sql } from '@vercel/postgres';
import { verifyToken } from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export default async function handler(req: any, res: any) {
  const { method } = req;

  // Authentication check (Secret Key is required for server-side verification)
  if (!CLERK_SECRET_KEY) {
    console.error('CLERK_SECRET_KEY is missing');
    return res.status(500).json({ error: 'Server configuration error' });
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

    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM memories WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return res.status(200).json(rows);
    }

    if (method === 'POST') {
      const { title, content, type, memory_layer, tags } = req.body;
      const { rows } = await sql`
        INSERT INTO memories (title, content, type, memory_layer, tags, user_id)
        VALUES (${title}, ${content}, ${type}, ${memory_layer}, ${JSON.stringify(tags)}, ${userId})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (method === 'PUT') {
      const { id, title, content, type, memory_layer, tags } = req.body;
      const { rows } = await sql`
        UPDATE memories
        SET title = ${title}, content = ${content}, type = ${type}, memory_layer = ${memory_layer}, tags = ${JSON.stringify(tags)}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM memories WHERE id = ${id} AND user_id = ${userId}`;
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
