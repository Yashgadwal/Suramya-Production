import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Retrieve services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST: Create or Update service (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, featuredImage, description, inclusions, customerType, displayOrder, enabled } = body;

    if (!name || !slug || !featuredImage || !description) {
      return NextResponse.json({ error: 'Missing required service fields' }, { status: 400 });
    }

    const serviceData = {
      name,
      slug,
      featuredImage,
      description,
      inclusions: Array.isArray(inclusions) ? JSON.stringify(inclusions) : inclusions || '[]',
      customerType: customerType || '',
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      enabled: enabled !== undefined ? !!enabled : true,
    };

    let service;
    if (id) {
      service = await prisma.service.update({
        where: { id },
        data: serviceData,
      });
    } else {
      service = await prisma.service.create({
        data: serviceData,
      });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save service' }, { status: 500 });
  }
}

// DELETE: Delete a service (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
