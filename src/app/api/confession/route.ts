import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const confessions = await prisma.content.findMany({
      where: { type: 'confession' },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(confessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch confessions.' }, { status: 500 });
  }
}
