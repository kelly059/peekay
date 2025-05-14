import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const { author, deleteToken } = await request.json();

    // Validate comment ID
    if (!commentId || isNaN(Number(commentId))) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Authorization check
    const isAuthorized = (
      comment.author === author ||
      comment.deleteToken === deleteToken
    );

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this comment' },
        { status: 403 }
      );
    }

    // Delete the comment and its replies
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: Number(commentId) },
          { parentId: Number(commentId) }
        ]
      }
    });

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}