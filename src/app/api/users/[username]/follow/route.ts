// src/app/api/users/[username]/follow/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const params = await context.params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
console.log("patatteesss");
    // Get target user ID
    const targetUser = db.prepare('SELECT id FROM users WHERE username = ?')
      .get(params.username) as { id: number } | undefined;

    console.log(targetUser);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.id === session.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check if already following
    const existing = db.prepare(
      'SELECT follower_id FROM follows WHERE follower_id = ? AND following_id = ?'
    ).get(session.id, targetUser.id);

    if (existing) {
      // Unfollow
      db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?')
        .run(session.id, targetUser.id);
      return NextResponse.json({ is_following: false });
    } else {
      // Follow
      db.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)')
        .run(session.id, targetUser.id);

      // Create notification
      db.prepare(`
        INSERT INTO notifications (user_id, type, actor_id) 
        VALUES (?, 'follow', ?)
      `).run(targetUser.id, session.id);

      return NextResponse.json({ is_following: true });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}