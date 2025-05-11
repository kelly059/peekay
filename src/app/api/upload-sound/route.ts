import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const videoFile = formData.get('file') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json(
        { error: 'Title and video file are required.' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary
    const videoUrl = await uploadToCloudinary(videoFile);

    // Store in database
    const content = await prisma.content.create({
      data: {
        title,
        video_url: videoUrl,
        type: 'sound', // ✅ "sound" content type
        cover_image: '', // Optional: set to null or empty if schema allows
      },
    });

    return NextResponse.json({ success: true, content }, { status: 201 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Upload file to Cloudinary
const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: filename,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Failed to upload'));
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};
