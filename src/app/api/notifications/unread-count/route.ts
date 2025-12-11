// src/app/api/notifications/unread-count/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ count: 0 });
    }

    const result = db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).get(session.id) as { count: number };

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return NextResponse.json({ count: 0 });
  }
}