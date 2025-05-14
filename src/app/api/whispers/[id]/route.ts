import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET content (whisper) by ID
export async function GET(request: Request, context: unknown) {
  try {
    const params = (context as { params: { id?: string } }).params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const content = await prisma.content.findUnique({
      where: { id: Number(id) },
      include: {
        comments: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            content: true,
            author: true,
            created_at: true,
            deleteToken: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('GET content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

// POST - Update content (whisper)
export async function POST(request: Request, context: unknown) {
  try {
    const params = (context as { params: { id?: string } }).params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const updatedContent = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('POST content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
