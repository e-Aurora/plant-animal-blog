// src/app/api/comments/[postId]/[commentId]/like/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  context: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const commentId = parseInt(params.commentId);

    // Check if already liked
    const existing = db.prepare(
      'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?'
    ).get(commentId, session.id);

    if (existing) {
      // Unlike
      db.prepare('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?')
        .run(commentId, session.id);
    } else {
      // Like
      db.prepare('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)')
        .run(commentId, session.id);

      // Get comment owner
      const comment = db.prepare('SELECT user_id, post_id FROM comments WHERE id = ?')
        .get(commentId) as { user_id: number; post_id: number } | undefined;

      if (comment && comment.user_id !== session.id) {
        // Create notification
        db.prepare(`
          INSERT INTO notifications (user_id, type, actor_id, comment_id, post_id) 
          VALUES (?, 'comment_like', ?, ?, ?)
        `).run(comment.user_id, session.id, commentId, comment.post_id);
      }
    }

    // Get updated like count
    const result = db.prepare(
      'SELECT COUNT(*) as likes FROM comment_likes WHERE comment_id = ?'
    ).get(commentId) as { likes: number };

    return NextResponse.json({
      likes: result.likes,
      isLiked: !existing
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}