// src/app/api/profile/[username]/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const params = await context.params;
    const username = params.username;

    const user = db.prepare(`
      SELECT 
        id,
        username,
        email
      FROM users
      WHERE username = ?
    `).get(username) as { id: number; username: string; email?: string } | undefined;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get post count
    const postCountResult = db.prepare(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?'
    ).get(user.id) as { count: number };

    // For now, follower count is 0 (implement following system later)
    const followerCount = 0;

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      postCount: postCountResult.count,
      followerCount
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}