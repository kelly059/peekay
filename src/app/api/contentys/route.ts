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
  } catch (err: unknown) {  // Use 'unknown' instead of 'any'
    if (err instanceof Error) {
      console.error('Fetch error:', err.message);  // Safely access the message property
      return NextResponse.json(
        { message: 'Failed to fetch contents', error: err.message },
        { status: 500 }
      );
    }
    
    // Fallback for any unknown error type
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { message: 'Failed to fetch contents', error: 'Unknown error' },
      { status: 500 }
    );
  }
}
