import { NextResponse } from 'next/server';
import  prisma  from '@/lib/db';

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  }

  try {
    await prisma.comment.deleteMany({
      where: { contentId: Number(id) },
    });

    await prisma.content.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
