// src/app/api/comments/[postId]/[commentId]/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ postId: string; commentId: string }> }
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

    const commentId = parseInt(params.commentId);

    // Check if comment belongs to user
    const comment = db.prepare(
      'SELECT user_id FROM comments WHERE id = ?'
    ).get(commentId) as { user_id: number } | undefined;

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (comment.user_id !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}