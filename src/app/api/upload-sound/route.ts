import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

// Disable the default body parser to handle FormData
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
  // Alternatively, you can set size limit like this (but bodyParser: false is often needed for file uploads)
  // maxBodyLength: 100 * 1024 * 1024, // 100MB
};

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get the form data
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const videoFile = formData.get('file') as File | null;

    if (!title || !videoFile) {
      return NextResponse.json(
        { error: 'Title and video file are required.' },
        { status: 400 }
      );
    }

    // Check file size (optional but recommended)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 100MB limit.' },
        { status: 413 }
      );
    }

    // Upload the file to Cloudinary
    const videoUrl = await uploadToCloudinary(videoFile);

    // Save video metadata to the database
    const content = await prisma.content.create({
      data: {
        title,
        video_url: videoUrl,
        type: 'sound',
        cover_image: '',
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

// Helper function to upload a File object to Cloudinary
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
          return reject(error || new Error('Failed to upload to Cloudinary'));
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};