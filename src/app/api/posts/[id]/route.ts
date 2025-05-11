import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Make sure you import prisma properly

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.content.findUnique({
      where: { id: Number(params.id) }, // Convert id to number
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error('[GET_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
