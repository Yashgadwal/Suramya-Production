import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Retrieve testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST: Create or Update testimonial (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin' && session.role !== 'Content Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, avatar, type, review, rating, sourceUrl, approved, featured } = body;

    if (!name || !review) {
      return NextResponse.json({ error: 'Missing required testimonial fields' }, { status: 400 });
    }

    const testimonialData = {
      name,
      avatar: avatar || null,
      type: type || 'Wedding Shoot',
      review,
      rating: rating ? parseInt(rating) : 5,
      sourceUrl: sourceUrl || null,
      approved: approved !== undefined ? !!approved : true,
      featured: !!featured,
    };

    let testimonial;
    if (id) {
      testimonial = await prisma.testimonial.update({
        where: { id },
        data: testimonialData,
      });
    } else {
      testimonial = await prisma.testimonial.create({
        data: testimonialData,
      });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}

// DELETE: Delete a testimonial (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
