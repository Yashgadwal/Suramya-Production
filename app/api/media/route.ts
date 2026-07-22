import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper to ensure upload folder exists
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// GET: List all media files in the uploads folder (Protected Admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    ensureUploadDir();
    const files = await fs.promises.readdir(UPLOAD_DIR);
    
    const mediaFiles = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(UPLOAD_DIR, filename);
        const stats = await fs.promises.stat(filePath);
        return {
          name: filename,
          url: `/uploads/${filename}`,
          sizeBytes: stats.size,
          createdAt: stats.birthtime,
          isImage: /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(filename),
          isVideo: /\.(mp4|webm|ogg|mov)$/i.test(filename),
        };
      })
    );

    // Sort by newest
    mediaFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(mediaFiles);
  } catch (error: any) {
    console.error('List media error:', error);
    return NextResponse.json({ error: 'Failed to list media library' }, { status: 500 });
  }
}

// POST: Upload a file to local storage (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    ensureUploadDir();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Sanitize filename: replace spaces and weird characters
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}_${cleanName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    // Write file to public/uploads
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      name: uniqueName,
      url: `/uploads/${uniqueName}`,
      size: file.size,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to save uploaded file' }, { status: 500 });
  }
}

// DELETE: Delete a file from local storage (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, name);

    // Prevent directory traversal attacks by verifying the resolved path is inside UPLOAD_DIR
    const relative = path.relative(UPLOAD_DIR, filePath);
    const isInside = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
    
    if (!isInside && relative !== '') {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return NextResponse.json({ success: true, message: 'File deleted from media library' });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
