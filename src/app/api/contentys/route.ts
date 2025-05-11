import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // ✅ Adjust the path if needed

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      where: { type: 'pet' },
      select: {
        id: true,
        title: true,
        image_url: true,
        video_url: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ data: contents }, { status: 200 });
  } catch (err: any) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { message: 'Failed to fetch contents', error: String(err) },
      { status: 500 }
    );
  }
}
