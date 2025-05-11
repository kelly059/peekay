// src/app/api/comments/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET comments for a content item
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");

    if (!contentId) {
      return NextResponse.json(
        { error: "Missing contentId parameter" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        contentId: Number(contentId),
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        content: true,
        author: true,
        created_at: true,
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new comment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, author, contentId, deleteToken } = body;

    // Validate request body
    if (!contentId || !content || !deleteToken) {
      return NextResponse.json(
        { error: "Missing required fields: content, contentId, deleteToken" },
        { status: 400 }
      );
    }

    // Check if the content exists
    const contentExists = await prisma.content.findUnique({
      where: { id: Number(contentId) },
    });

    if (!contentExists) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Create comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: author || "Anonymous",
        deleteToken,
        contentRef: {
          connect: { id: Number(contentId) },
        },
      },
    });

    // Return just what the frontend needs
    return NextResponse.json({ id: newComment.id }, { status: 201 });
  } catch (error: any) {
    console.error("POST comment error:", error);
    return NextResponse.json(
      { error: "Failed to create comment", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a comment by ID and deleteToken
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    const deleteToken = searchParams.get("deleteToken");

    if (!commentId || !deleteToken) {
      return NextResponse.json(
        { error: "Missing commentId or deleteToken" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.deleteToken !== deleteToken) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    return NextResponse.json(
      { success: true, message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment", details: error.message },
      { status: 500 }
    );
  }
}
