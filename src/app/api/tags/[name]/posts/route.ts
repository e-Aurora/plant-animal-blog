// API Route: src/app/api/tags/[name]/posts/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const params = await context.params;
    const tagName = decodeURIComponent(params.name);

    const posts = db.prepare(`
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.excerpt,
        p.created_at,
        u.avatar_emoji,
        u.username,
        COUNT(DISTINCT l.id) as likes
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      WHERE t.name = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all(tagName);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}