import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const confessions = await prisma.content.findMany({
      where: { type: 'confession' },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(confessions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to load confessions.' },
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
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    let coverImageUrl: string | null = null;

    if (coverImage) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const filename = `${Date.now()}_${coverImage.name.replace(/\s+/g, '_')}_${randomUUID()}`;

      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              public_id: `confessions/${filename}`,
              folder: 'confessions',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          ).end(buffer);
        });

        coverImageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return NextResponse.json(
          { error: 'Failed to upload image to Cloudinary.' },
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create confession.' },
      { status: 500 }
    );
  }
}
