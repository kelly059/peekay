import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      where: { type: 'love song' }, // ✅ matches your upload
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
