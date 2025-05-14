import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const whispers = await prisma.content.findMany({
      where: { type: 'whisper' },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(whispers, { status: 200 });
  } catch (error) {
    console.error('❌ Failed to fetch whispers:', error);
    return NextResponse.json({ error: 'Failed to load whispers.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const coverImage = formData.get('cover_image') as File | null;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    let coverImageUrl: string | null = null;

    if (coverImage) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const filename = `${Date.now()}_${coverImage.name.replace(/\s+/g, '_')}_${randomUUID()}`;

      interface CloudinaryUploadResult {
        secure_url: string;
        [key: string]: unknown;
      }

      const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: `whispers/${filename}`,
            folder: 'whispers',
          },
          (error, result) => {
            if (error || !result) return reject(error || new Error('No result from Cloudinary'));
            resolve(result as CloudinaryUploadResult);
          }
        ).end(buffer);
      });

      coverImageUrl = uploadResult.secure_url;
    }

    const whisper = await prisma.content.create({
      data: {
        title,
        description,
        cover_image: coverImageUrl,
        type: 'whisper',
      },
    });

    return NextResponse.json(whisper, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to create whisper:', message);
    return NextResponse.json({ error: 'Failed to create whisper.' }, { status: 500 });
  }
}
