import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // adjust if your prisma instance path is different

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const { commentId } = params;

  try {
    // Optional: Validate the confession ID exists, if needed
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
