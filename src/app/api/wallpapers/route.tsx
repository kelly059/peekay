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
    const parsedWallpapers = wallpapers.map((w) => ({
      ...w,
      description: w.description ?? '', // Default to empty string if null
      image_url: w.image_url ?? '', // Default to empty string if null
      category: w.category ?? '', // Default to empty string if null
      tags: Array.isArray(w.tags) ? w.tags : [], // Ensure tags is an array
    }));

    return NextResponse.json({ success: true, wallpapers: parsedWallpapers });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching wallpapers:', errMessage);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch wallpapers.',
        error: process.env.NODE_ENV === 'development' ? errMessage : undefined,
      },
      { status: 500 }
    );
  }
}
