// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password, email } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get(username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = db
      .prepare(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)'
      )
      .run(username, hashedPassword, email || null);

    const userId = result.lastInsertRowid as number;

    // Create token and set cookie
    const token = await createToken({ id: userId, username });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: userId, username },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}