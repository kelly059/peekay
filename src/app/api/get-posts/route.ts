import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const posts = await prisma.content.findMany({
      orderBy: { id: 'desc' }, // optional: latest first
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
