// src/app/api/auth/delete-account/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { getSession, verifyPassword, removeAuthCookie } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Verify password
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(session.id) as { password: string };
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Delete user (CASCADE will handle related data)
    db.prepare('DELETE FROM users WHERE id = ?').run(session.id);
    
    await removeAuthCookie();
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}