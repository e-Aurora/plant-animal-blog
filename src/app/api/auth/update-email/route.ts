// src/app/api/auth/update-email/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession, verifyPassword } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { email, password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Verify password
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(session.id) as { password: string };
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Check if email already exists
    if (email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .get(email, session.id);

      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email || null, session.id);

    return NextResponse.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
  }
}