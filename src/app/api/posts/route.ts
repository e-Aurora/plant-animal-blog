// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '12';
    const offset = searchParams.get('offset') || '0';

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
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(parseInt(limit), parseInt(offset)) as any[];

    // Get tags for each post
    for (const post of posts) {
      const tags = db.prepare(`
        SELECT t.name
        FROM tags t
        INNER JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `).all(post.id) as Array<{ name: string }>;
      
      post.tags = tags.map(t => t.name);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}