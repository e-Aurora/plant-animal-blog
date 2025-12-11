// src/app/api/auth/update-avatar/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { avatar_emoji } = await request.json();
    
    if (!avatar_emoji) {
      return NextResponse.json({ error: 'Avatar emoji is required' }, { status: 400 });
    }

    db.prepare('UPDATE users SET avatar_emoji = ? WHERE id = ?').run(avatar_emoji, session.id);

    return NextResponse.json({ avatar_emoji, message: 'Avatar updated successfully' });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}