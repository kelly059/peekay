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

    // Define the type of each wallpaper item
    type Wallpaper = {
      id: number;
      title: string;
      description: string | null;
      image_url: string | null;
      category: string | null;
      tags: unknown; // Use `unknown` initially, or better if you know it's always a string[]
    };

    const parsedWallpapers = wallpapers.map((w: Wallpaper) => ({
      ...w,
      description: w.description ?? '',
      image_url: w.image_url ?? '',
      category: w.category ?? '',
      tags: Array.isArray(w.tags) ? (w.tags as string[]) : [], // Safely cast unknown to string[]
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
