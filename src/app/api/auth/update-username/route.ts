// src/app/api/auth/update-username/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession, createToken, setAuthCookie } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { username } = await request.json();
    
    if (!username || username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    // Check if username exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?')
      .get(username, session.id);

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Update username
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, session.id);

    // Create new token with updated username
    const token = await createToken({ id: session.id, username });
    await setAuthCookie(token);

    return NextResponse.json({ username, message: 'Username updated successfully' });
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json({ error: 'Failed to update username' }, { status: 500 });
  }
}