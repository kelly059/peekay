// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import os from 'os';  // <-- Added this import

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

// Utility: Get a string value from FormData
const getSingleValue = (value: FormDataEntryValue | null): string =>
  (value instanceof File ? value.name : value) || '';

// Utility: Safely parse JSON from FormData
const parseJsonField = (value: FormDataEntryValue | null): unknown => {
  try {
    return JSON.parse(getSingleValue(value));
  } catch {
    return undefined;
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Validate file upload
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Required fields
    const title = getSingleValue(formData.get('title'));
    const content = getSingleValue(formData.get('content'));

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Save to temporary location
    const tempDir = join(os.tmpdir(), 'temp');  // <-- Changed this line
    await mkdir(tempDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tempDir, file.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempPath, {
      resource_type: 'auto',
    });

    // Create database record
    const newContent = await prisma.content.create({
      data: {
        title,
        description: content,
        image_url: uploadResult.resource_type === 'image' ? uploadResult.secure_url : null,
        video_url: uploadResult.resource_type === 'video' ? uploadResult.secure_url : null,
        extra_links: parseJsonField(formData.get('extra_links')) as object | undefined,
        tags: parseJsonField(formData.get('tags')) as string[] | undefined,
        category: getSingleValue(formData.get('category')),
      },
    });

    // Cleanup
    await unlink(tempPath);

    return NextResponse.json({ success: true, content: newContent });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
