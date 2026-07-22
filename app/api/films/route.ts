import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Retrieve films
export async function GET() {
  try {
    const films = await prisma.weddingFilm.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(films);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch films' }, { status: 500 });
  }
}

// POST: Create or Update film (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin' && session.role !== 'Content Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, url, thumbnail, isVertical, description, featured, order } = body;

    if (!title || !url || !thumbnail) {
      return NextResponse.json({ error: 'Missing required film fields' }, { status: 400 });
    }

    const filmData = {
      title,
      url,
      thumbnail,
      isVertical: !!isVertical,
      description: description || null,
      featured: !!featured,
      order: order ? parseInt(order) : 0,
    };

    let film;
    if (id) {
      film = await prisma.weddingFilm.update({
        where: { id },
        data: filmData,
      });
    } else {
      film = await prisma.weddingFilm.create({
        data: filmData,
      });
    }

    return NextResponse.json(film);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save film' }, { status: 500 });
  }
}

// DELETE: Delete a film (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
    }

    await prisma.weddingFilm.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Film deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete film' }, { status: 500 });
  }
}
