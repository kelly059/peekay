import { NextResponse } from 'next/server';
import { PrismaClient, Comment as PrismaComment } from '@prisma/client';

const prisma = new PrismaClient();

// Improved type for error details
type ErrorDetails = Record<string, unknown> | string;

// Helper to send consistent error responses
const errorResponse = (message: string, status: number, details?: ErrorDetails) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  );
};

// Type for nested comment replies
type NestedComment = PrismaComment & {
  replies?: NestedComment[];
};

// Helper to format dates and nested replies
const formatComment = (comment: NestedComment): NestedComment => ({
  ...comment,
  created_at: comment.created_at.toISOString() as unknown as Date, // Cast back to Date if needed
  replies: comment.replies ? comment.replies.map(formatComment) : [],
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const confessionId = searchParams.get('confessionId');

    if (!confessionId || isNaN(Number(confessionId))) {
      return errorResponse('Valid confessionId is required', 400);
    }

    const comments = await prisma.comment.findMany({
      where: { contentId: Number(confessionId) },
      include: { replies: true },
      orderBy: { created_at: 'asc' },
    });

    const rootComments = comments.filter((c) => !c.parentId);

    return NextResponse.json({
      success: true,
      data: rootComments.map(formatComment),
    });
  } catch (error) {
    console.error('GET Error:', error);
    return errorResponse('Failed to fetch comments', 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      content: string;
      author?: string;
      parentId?: number;
      confessionId: number;
    };

    const { content, author, parentId, confessionId } = body;

    if (!content) return errorResponse('Content is required', 400);
    if (!confessionId) return errorResponse('Confession ID is required', 400);

    const newComment = await prisma.comment.create({
      data: {
        content,
        author: author || 'Anonymous',
        contentId: Number(confessionId),
        parentId: parentId ? Number(parentId) : null,
        deleteToken: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        created_at: new Date(),
      },
      include: { replies: true },
    });

    return NextResponse.json(
      { success: true, data: formatComment(newComment) },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return errorResponse('Failed to create comment', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    const body = await request.json() as {
      author?: string;
      deleteToken?: string;
    };

    const { author, deleteToken } = body;

    if (!commentId) return errorResponse('Comment ID required', 400);

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) return errorResponse('Comment not found', 404);

    if (comment.author !== author && comment.deleteToken !== deleteToken) {
      return errorResponse('Unauthorized', 403);
    }

    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: Number(commentId) },
          { parentId: Number(commentId) },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Error:', error);
    return errorResponse('Failed to delete comment', 500);
  }
}
