import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const videoFile = formData.get('video') as File | null;
    const coverFile = formData.get('cover') as File | null;

    if (!title || !videoFile || !coverFile) {
      return NextResponse.json({ error: 'Title, video, and cover image are required.' }, { status: 400 });
    }

    // Upload video to Cloudinary
    const videoPath = await uploadToCloudinary(videoFile);
    // Upload cover image to Cloudinary
    const coverPath = await uploadToCloudinary(coverFile);

    // Create a record in the database with Cloudinary URLs
    const content = await prisma.content.create({
      data: {
        title,
        video_url: videoPath,
        cover_image: coverPath,
        type: 'love song', // ✅ important
      },
    });

    return NextResponse.json({ success: true, content }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', public_id: filename },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    ).end(buffer);
  });
};
