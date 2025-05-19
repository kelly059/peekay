import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    console.time('Fetching blog posts');
    const blogs = await prisma.content.findMany({
      where: { type: 'blog' },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true, // For preview text
        image_url: true,
        created_at: true,
        is_featured: true,
        // Removed: is_trending (it does not exist in your schema)
      },
    });
    console.timeEnd('Fetching blog posts');
    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error('❌ Failed to fetch blogs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
