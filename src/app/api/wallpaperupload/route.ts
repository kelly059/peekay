// ./src/app/api/wallpaperupload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ success: false, message: 'Invalid Content-Type' }, { status: 400 });
    }

    const formData = await req.formData();

    // Extract fields from formData
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const tagsRaw = formData.get('tags')?.toString() || '';
    const category = formData.get('category')?.toString() || '';
    const type = formData.get('type')?.toString() || 'wallpaper';

    console.log('DEBUG TYPE:', type);

    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag);

    const file = formData.get('image') as File;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define Cloudinary upload result type
    interface CloudinaryUploadResult {
      secure_url: string;
      [key: string]: unknown;
    }

    const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: type,
          public_id: uuidv4(),
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      ).end(buffer);
    });

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        type,
        category,
        tags,
        image_url: uploadResult.secure_url,
        cover_image: uploadResult.secure_url,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    return NextResponse.json({ success: true, content: newContent }, { status: 200 });

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Upload error:', errMessage);
    return NextResponse.json(
      {
        success: false,
        message: errMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
