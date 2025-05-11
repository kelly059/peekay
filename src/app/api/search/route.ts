// app/api/search/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type'); // e.g., "blog", "wallpaper", etc.

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const query = q.toLowerCase();

    const results = await prisma.content.findMany({
      where: {
        AND: [
          type ? { type } : {}, // optional type filtering
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  array_contains: [query], // assumes tags is an array
                },
              },
            ],
          },
        ],
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    // Normalize tags to arrays to prevent frontend errors
    const safeResults = results.map(item => ({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));

    return NextResponse.json(safeResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
