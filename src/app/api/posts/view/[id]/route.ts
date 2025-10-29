// src/app/api/posts/view/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();
    const postId = parseInt(params.id);

    const post = db.prepare(`
      SELECT 
        p.id,
        p.user_id,
        p.title,
        p.content,
        p.excerpt,
        p.created_at,
        u.username,
        COUNT(DISTINCT l.id) as likes
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(postId) as any;

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if current user has liked this post
    let isLiked = false;
    if (session) {
      const like = db.prepare(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?'
      ).get(postId, session.id);
      isLiked = !!like;
    }

    return NextResponse.json({ ...post, isLiked });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}