// src/app/api/users/[username]/posts/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const params = await context.params;

    const posts = db.prepare(`
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.excerpt,
        p.created_at,
        u.username,
        COUNT(l.id) as likes
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE u.username = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all(params.username);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}