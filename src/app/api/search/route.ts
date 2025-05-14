import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const query = q.toLowerCase();

    const results = await prisma.content.findMany({
      where: {
        AND: [
          type ? { type } : {},
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              {
                tags: {
                  array_contains: [query],
                },
              },
            ],
          },
        ],
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    const safeResults = results.map((item) => ({
      ...item,
      tags: Array.isArray(item.tags) && item.tags.every(tag => typeof tag === 'string')
        ? item.tags
        : [],
    }));

    return NextResponse.json(safeResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
