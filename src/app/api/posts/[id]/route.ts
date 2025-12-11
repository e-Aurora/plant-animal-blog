// src/app/api/posts/[id]/route.ts - PUT method only
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function PUT(
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
    const { title, content, excerpt, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const post = db
      .prepare('SELECT user_id FROM posts WHERE id = ?')
      .get(postId) as { user_id: number } | undefined;

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (post.user_id !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update post
    db.prepare(
      'UPDATE posts SET title = ?, content = ?, excerpt = ? WHERE id = ?'
    ).run(title, content, excerpt || '', postId);

    // Update tags
    db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(postId);
    
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        let tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as { id: number } | undefined;
        
        if (!tag) {
          const tagResult = db.prepare('INSERT INTO tags (name) VALUES (?)').run(tagName);
          tag = { id: tagResult.lastInsertRowid as number };
        }

        db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)').run(postId, tag.id);
      }
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}