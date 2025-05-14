import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Define an interface for your content items
interface ContentItem {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  tags: unknown; // Changed from 'any' to 'unknown' which is safer
  created_at: Date;
  // Add any other fields your content model has
}

// Define the type for the normalized content item
interface SafeContentItem extends Omit<ContentItem, 'tags'> {
  tags: string[];
}

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
    }) as ContentItem[];

    const safeResults = results.map((item: ContentItem): SafeContentItem => ({
      ...item,
      tags: Array.isArray(item.tags) && item.tags.every((tag: unknown) => typeof tag === 'string')
        ? item.tags as string[]
        : [],
    }));

    return NextResponse.json(safeResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}