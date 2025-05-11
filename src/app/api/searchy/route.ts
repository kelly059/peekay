import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get('query');
    const type = searchParams.get('type'); // optional type filter

    if (!rawQuery || rawQuery.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Missing search query.' },
        { status: 400 }
      );
    }

    const query = rawQuery.toLowerCase();

    const results = await prisma.content.findMany({
      where: {
        AND: [
          type ? { type } : {}, // only apply filter if type is provided
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                tags: {
                  array_contains: [query],
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error('[SEARCH_API_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}
