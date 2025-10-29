// src/app/api/posts/[id]/like/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);

    // Check if already liked
    const existingLike = db.prepare(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?'
    ).get(postId, session.id);

    if (existingLike) {
      // Unlike
      db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(
        postId,
        session.id
      );
    } else {
      // Like
      db.prepare('INSERT INTO likes (post_id, user_id) VALUES (?, ?)').run(
        postId,
        session.id
      );
    }

    // Get updated like count
    const result = db.prepare(
      'SELECT COUNT(*) as likes FROM likes WHERE post_id = ?'
    ).get(postId) as { likes: number };

    return NextResponse.json({
      likes: result.likes,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}