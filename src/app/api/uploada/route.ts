// app/api/uploada/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const category = formData.get('category') as string | null;
    const slug = formData.get('slug') as string | null;
    const type = (formData.get('type') as string) || 'blog';
    const tagsRaw = formData.get('tags') as string | null;
    const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

    const file = formData.get('file') as File | null;
    const cover = formData.get('cover_image') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Upload file (image/video) to Cloudinary
    const uploadResult = await uploadToCloudinary(file);

    // Upload optional cover image
    let coverUrl: string | null = null;
    if (cover) {
      coverUrl = await uploadToCloudinary(cover);
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        category,
        slug,
        type,
        tags,
        cover_image: coverUrl || uploadResult,
        image_url: isImage(file) ? uploadResult : null,
        video_url: isVideo(file) ? uploadResult : null,
      },
    });

    return NextResponse.json({ message: 'Upload successful', data: newContent });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', public_id: filename, folder: 'uploads' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url ?? '');
      }
    ).end(buffer);
  });
};

const isImage = (file: File) => file.type.startsWith('image/');
const isVideo = (file: File) => file.type.startsWith('video/');
