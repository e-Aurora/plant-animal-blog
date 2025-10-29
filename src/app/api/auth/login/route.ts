// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = db
      .prepare('SELECT id, username, password FROM users WHERE username = ?')
      .get(username) as { id: number; username: string; password: string } | undefined;

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token and set cookie
    const token = await createToken({ id: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, username: user.username },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}