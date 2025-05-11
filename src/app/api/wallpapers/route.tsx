import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const wallpapers = await prisma.content.findMany({
      where: {
        type: 'wallpaper',
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        category: true,
        tags: true,
      },
      take: 100,
    });

    // Convert Prisma `Json` fields to JS arrays
    const parsedWallpapers = wallpapers.map(w => ({
      ...w,
      tags: Array.isArray(w.tags) ? w.tags : [],
    }));

    return NextResponse.json({ success: true, wallpapers: parsedWallpapers });
  } catch (error: any) {
    console.error('❌ Error fetching wallpapers:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch wallpapers.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
