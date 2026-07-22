import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Toggle favorite status of a gallery media item (Public client action)
export async function PATCH(request: Request) {
  try {
    const { mediaId, isFavorite } = await request.json();

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const updatedMedia = await prisma.clientGalleryMedia.update({
      where: { id: mediaId },
      data: { isFavorite: !!isFavorite },
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('Gallery favorite toggle error:', error);
    return NextResponse.json({ error: 'Failed to update favorite status' }, { status: 500 });
  }
}
