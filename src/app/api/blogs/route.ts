import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching blog posts...');

    const blogs = await prisma.content.findMany({
      where: {
        type: 'blog', // ✅ Filter by type
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        video_url: true,
        extra_links: true,
        tags: true,
        category: true,
        created_at: true,
        type: true, // ✅ Include type in result if needed
      },
    });

    console.log('Fetched blogs:', blogs);

    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error('❌ Failed to fetch blogs:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
