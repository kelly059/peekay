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
    const type = formData.get('type')?.toString() || 'wallpaper'; // Default to wallpaper

    // Debug log to verify type is being passed
    console.log('DEBUG TYPE:', type);

    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Get image file
    const file = formData.get('image') as File;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: type, // Save by type (e.g., blog, wallpaper)
          public_id: uuidv4(),
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Save to database
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

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
