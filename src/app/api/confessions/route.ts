import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

interface CloudinaryUploadResult {
  secure_url: string;
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
  [key: string]: unknown; // Use `unknown` instead of `any` for type safety
}

export async function GET() {
  try {
    const confessions = await prisma.content.findMany({
      where: { type: 'confession' },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(confessions, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load confessions';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const coverImage = formData.get('cover_image') as File | null;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    let coverImageUrl: string | null = null;

    if (coverImage) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const filename = `${Date.now()}_${coverImage.name.replace(/\s+/g, '_')}_${randomUUID()}`;

      try {
        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              public_id: `confessions/${filename}`,
              folder: 'confessions',
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result) return reject(new Error('No result from Cloudinary'));
              resolve(result as CloudinaryUploadResult);
            }
          ).end(buffer);
        });

        coverImageUrl = uploadResult.secure_url;
      } catch (err: unknown) {
        console.error('Cloudinary upload error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image to Cloudinary';
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }

    const confession = await prisma.content.create({
      data: {
        title,
        description,
        cover_image: coverImageUrl,
        type: 'confession',
      },
    });

    return NextResponse.json(confession, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create confession';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
