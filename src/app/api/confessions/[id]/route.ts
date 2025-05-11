import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

// GET single confession by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const confession = await prisma.content.findUnique({
      where: { id: Number(params.id) },
      include: {
        comments: {
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            content: true,
            author: true,
            created_at: true,
            deleteToken: true
          }
        }
      }
    });

    if (!confession) {
      return NextResponse.json(
        { error: 'Confession not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(confession);
  } catch (error) {
    console.error('GET confession error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch confession' },
      { status: 500 }
    );
  }
}

// POST - Update confession
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('cover_image') as File | null;

    let cover_image: string | undefined;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'confessions' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      cover_image = uploadRes.secure_url;
    }

    const updatedConfession = await prisma.content.update({
      where: { id: Number(params.id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(cover_image && { cover_image })
      }
    });

    return NextResponse.json(updatedConfession);
  } catch (error) {
    console.error('POST confession error:', error);
    return NextResponse.json(
      { error: 'Failed to update confession' },
      { status: 500 }
    );
  }
}