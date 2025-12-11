// src/app/api/tags/search/route.ts
import { NextResponse } from 'next/server';
import db from '@/db/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const tags = db.prepare(`
      SELECT name FROM tags 
      WHERE name LIKE ? 
      ORDER BY name ASC 
      LIMIT 10
    `).all(`%${query}%`) as Array<{ name: string }>;

    return NextResponse.json({ tags: tags.map(t => t.name) });
  } catch (error) {
    console.error('Error searching tags:', error);
    return NextResponse.json({ error: 'Failed to search tags' }, { status: 500 });
  }
}