// app/api/content/route.ts
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing content ID' }, { status: 400 });
  }

  const content = await prisma.content.findUnique({
    where: { id: Number(id) },
  });

  if (!content) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(content);
}
