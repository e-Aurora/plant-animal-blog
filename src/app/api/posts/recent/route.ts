// src/app/api/posts/recent/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET() {
  try {
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
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent posts' },
      { status: 500 }
    );
  }
}