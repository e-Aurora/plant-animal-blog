// src/app/api/comments/[postId]/route.ts (UPDATED POST method)
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();
    const postId = parseInt(params.postId);

    const comments = db.prepare(`
      SELECT 
        c.id,
        c.post_id,
        c.user_id,
        c.content,
        c.created_at,
        u.username,
        u.avatar_emoji,
        COUNT(cl.id) as likes
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.post_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all(postId) as any[];

    // Check which comments the current user has liked
    if (session) {
      const commentIds = comments.map(c => c.id);
      if (commentIds.length > 0) {
        const userLikes = db.prepare(`
          SELECT comment_id 
          FROM comment_likes 
          WHERE user_id = ? AND comment_id IN (${commentIds.join(',')})
        `).all(session.id) as Array<{ comment_id: number }>;

        const likedSet = new Set(userLikes.map(l => l.comment_id));
        comments.forEach(comment => {
          comment.isLiked = likedSet.has(comment.id);
        });
      }
    }

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ postId: string }> }
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

    const postId = parseInt(params.postId);
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Insert comment
    const result = db.prepare(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)'
    ).run(postId, session.id, content.trim());

    // Get post owner
    const post = db.prepare('SELECT user_id FROM posts WHERE id = ?')
      .get(postId) as { user_id: number } | undefined;

    // Create notification (only if not commenting on own post)
    if (post && post.user_id !== session.id) {
      db.prepare(`
        INSERT INTO notifications (user_id, type, actor_id, post_id, comment_id) 
        VALUES (?, 'comment', ?, ?, ?)
      `).run(post.user_id, session.id, postId, result.lastInsertRowid);
    }

    return NextResponse.json({
      id: result.lastInsertRowid,
      message: 'Comment posted successfully',
    });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}