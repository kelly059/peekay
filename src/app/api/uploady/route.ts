import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

// Create a Prisma client instance
const prisma = new PrismaClient();

// POST handler for file upload
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const videoFile = formData.get('video') as File | null;
    const coverFile = formData.get('cover') as File | null;

    if (!title || !videoFile || !coverFile) {
      return NextResponse.json(
        { error: 'Title, video, and cover image are required.' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary
    const videoPath = await uploadToCloudinary(videoFile, 'video');

    // Upload cover image to Cloudinary
    const coverPath = await uploadToCloudinary(coverFile, 'image');

    // Save content data to Prisma database
    const content = await prisma.content.create({
      data: {
        title,
        video_url: videoPath,
        cover_image: coverPath,
        type: 'love song',
      },
    });

    return NextResponse.json({ success: true, content }, { status: 201 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (
  file: File,
  type: 'video' | 'image'
): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: type,
        public_id: filename,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Failed to upload to Cloudinary'));
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};
