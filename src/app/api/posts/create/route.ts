// Updated API: src/app/api/posts/create/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, content, excerpt, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Insert post
    const result = db
      .prepare(
        'INSERT INTO posts (user_id, title, content, excerpt) VALUES (?, ?, ?, ?)'
      )
      .run(session.id, title, content, excerpt || '');

    const postId = result.lastInsertRowid as number;

    // Handle tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        let tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as { id: number } | undefined;
        
        if (!tag) {
          const tagResult = db.prepare('INSERT INTO tags (name) VALUES (?)').run(tagName);
          tag = { id: tagResult.lastInsertRowid as number };
        }

        // Link tag to post
        db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)').run(postId, tag.id);
      }
    }

    return NextResponse.json({
      id: postId,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}