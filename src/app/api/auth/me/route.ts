import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/db/database';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // DB’den gerçek kullanıcıyı alıyoruz
    const user = await db
      .prepare('SELECT id, username, avatar_emoji FROM users WHERE id = ?')
      .get(session.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
