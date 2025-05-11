import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const contentId = parseInt(params.id);

  if (isNaN(contentId)) {
    return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { contentId },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const contentId = parseInt(params.id);

  if (isNaN(contentId)) {
    return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
  }

  try {
    const { content, author } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        author: author || 'Anonymous',
        contentId,
        deleteToken: randomUUID(),
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
