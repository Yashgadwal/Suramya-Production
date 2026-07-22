import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: List all events (Protected Admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}

// POST: Create a manual event / calendar block (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date, type, notes, color } = await request.json();

    if (!title || !date || !type) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        type,
        notes: notes || null,
        color: color || 'gold',
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
