// /app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const contentId = parseInt(req.nextUrl.searchParams.get('contentId') || '');
  if (isNaN(contentId)) {
    return NextResponse.json({ error: 'Invalid contentId' }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { contentId },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contentId, content, author } = body;

  if (!contentId || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      contentId,
      content,
      author,
      deleteToken: crypto.randomUUID(), // you can improve this later
    },
  });

  return NextResponse.json(comment);
}
