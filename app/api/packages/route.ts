import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Retrieve packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST: Create or Update package (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      price,
      priceType,
      description,
      hoursCovered,
      photographersCount,
      videographersCount,
      deliverables,
      albumsCount,
      droneEnabled,
      reelsEnabled,
      highlightFilmEnabled,
      deliveryWeeks,
      badge,
      featured,
      order,
      visible,
    } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required package fields' }, { status: 400 });
    }

    const packageData = {
      name,
      price: price ? parseFloat(price) : null,
      priceType: priceType || 'Starting From',
      description,
      hoursCovered: hoursCovered ? parseInt(hoursCovered) : null,
      photographersCount: photographersCount ? parseInt(photographersCount) : 0,
      videographersCount: videographersCount ? parseInt(videographersCount) : 0,
      deliverables: Array.isArray(deliverables) ? JSON.stringify(deliverables) : deliverables || '[]',
      albumsCount: albumsCount ? parseInt(albumsCount) : 0,
      droneEnabled: !!droneEnabled,
      reelsEnabled: !!reelsEnabled,
      highlightFilmEnabled: !!highlightFilmEnabled,
      deliveryWeeks: deliveryWeeks ? parseInt(deliveryWeeks) : 6,
      badge: badge || null,
      featured: !!featured,
      order: order ? parseInt(order) : 0,
      visible: visible !== undefined ? !!visible : true,
    };

    let pkg;
    if (id) {
      pkg = await prisma.package.update({
        where: { id },
        data: packageData,
      });
    } else {
      pkg = await prisma.package.create({
        data: packageData,
      });
    }

    return NextResponse.json(pkg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save package' }, { status: 500 });
  }
}

// DELETE: Delete a package (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Package removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
