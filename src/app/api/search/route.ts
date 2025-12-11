// src/app/api/search/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    let posts: any[] = [];
    let users: any[] = [];
    let tags: any[] = [];

    if (type === 'all' || type === 'posts') {
      posts = db.prepare(`
        SELECT p.id, p.title, p.excerpt, u.username, COUNT(l.id) as likes
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN likes l ON p.id = l.post_id
        WHERE p.title LIKE ? OR p.content LIKE ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 10
      `).all(`%${query}%`, `%${query}%`);
    }

    if (type === 'all' || type === 'users') {
      users = db.prepare(`
        SELECT 
          u.username, 
          u.avatar_emoji,
          COUNT(DISTINCT f.follower_id) as follower_count
        FROM users u
        LEFT JOIN follows f ON u.id = f.following_id
        WHERE u.username LIKE ?
        GROUP BY u.id
        ORDER BY follower_count DESC
        LIMIT 10
      `).all(`%${query}%`);
    }

    if (type === 'all' || type === 'tags') {
      tags = db.prepare(`
        SELECT t.name, COUNT(pt.post_id) as post_count
        FROM tags t
        LEFT JOIN post_tags pt ON t.id = pt.tag_id
        WHERE t.name LIKE ?
        GROUP BY t.id
        ORDER BY post_count DESC
        LIMIT 10
      `).all(`%${query}%`);
    }

    return NextResponse.json({ posts, users, tags });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}