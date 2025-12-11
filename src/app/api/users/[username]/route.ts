// src/app/api/users/[username]/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();

    const user = db.prepare(`
      SELECT 
        u.username,
        u.avatar_emoji,
        u.created_at,
        COUNT(DISTINCT p.id) as post_count,
        COUNT(DISTINCT f1.follower_id) as follower_count,
        COUNT(DISTINCT f2.following_id) as following_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      LEFT JOIN follows f1 ON u.id = f1.following_id
      LEFT JOIN follows f2 ON u.id = f2.follower_id
      WHERE u.username = ?
      GROUP BY u.id
    `).get(params.username) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let is_following = false;
    if (session) {
      const follow = db.prepare(`
        SELECT 1 FROM follows 
        WHERE follower_id = ? AND following_id = (
          SELECT id FROM users WHERE username = ?
        )
      `).get(session.id, params.username);
      is_following = !!follow;
    }

    return NextResponse.json({
      ...user,
      is_following,
      is_own_profile: session?.username === params.username
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}