// src/app/api/notifications/read-all/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?')
      .run(session.id);

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}