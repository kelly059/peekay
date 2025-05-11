// app/api/content-by-category/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // your Prisma client

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const posts = await prisma.content.findMany({
      where: {
        category: category,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        video_url: true,
        extra_links: true,
        tags: true,
        category: true,
        created_at: true,
      },
    });

    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('❌ Failed to fetch posts by category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
