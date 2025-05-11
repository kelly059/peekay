import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, category, tags, content } = body;

    // Validate required fields
    if (!id || !title || !category || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const updatedContent = await prisma.content.update({
      where: { id: Number(id) }, // Always cast to Number (Prisma expects number for ID)
      data: {
        title,
        category,
        tags, // Make sure tags is passed as JSON array
        description: content, // Save editor content inside description field
      },
    });

    return NextResponse.json({ success: true, post: updatedContent }, { status: 200 });
  } catch (error) {
    console.error('[EDIT_CONTENT_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
