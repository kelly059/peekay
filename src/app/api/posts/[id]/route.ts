import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Make sure you import prisma properly

export async function GET(req: NextRequest, context: unknown) {
  try {
    const params = (context as { params: { id?: string } }).params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const post = await prisma.content.findUnique({
      where: { id: Number(id) },
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
