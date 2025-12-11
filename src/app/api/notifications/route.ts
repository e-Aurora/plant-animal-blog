// src/app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const notifications = db.prepare(`
      SELECT 
        n.id,
        n.type,
        n.is_read,
        n.created_at,
        n.post_id,
        n.comment_id,
        u.username as actor_username,
        u.avatar_emoji as actor_avatar,
        p.title as post_title
      FROM notifications n
      LEFT JOIN users u ON n.actor_id = u.id
      LEFT JOIN posts p ON n.post_id = p.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `).all(session.id);

    const unreadCount = db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).get(session.id) as { count: number };

    return NextResponse.json({ 
      notifications, 
      unreadCount: unreadCount.count 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}