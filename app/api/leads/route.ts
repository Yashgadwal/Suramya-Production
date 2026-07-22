import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// POST: Create a lead (Public booking form submission)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      shootType,
      eventDate,
      altDate,
      city,
      venue,
      guestCount,
      servicesNeeded,
      name,
      phone,
      whatsapp,
      email,
      budget,
      source,
      message,
    } = body;

    if (!name || !phone || !email || !shootType || !eventDate || !city) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Auto-generate Enquiry ID: SUR-1001, SUR-1002, etc.
    const count = await prisma.lead.count();
    const nextNum = 1001 + count;
    const enquiryId = `SUR-${nextNum}`;

    const newLead = await prisma.lead.create({
      data: {
        enquiryId,
        shootType,
        eventDate: new Date(eventDate),
        altDate: altDate ? new Date(altDate) : null,
        city,
        venue: venue || null,
        guestCount: guestCount ? parseInt(guestCount) : null,
        servicesNeeded: Array.isArray(servicesNeeded) 
          ? JSON.stringify(servicesNeeded) 
          : servicesNeeded || '[]',
        name,
        phone,
        whatsapp: whatsapp || phone,
        email,
        budget: budget || null,
        source: source || 'Website',
        message: message || null,
        status: 'New',
      },
    });

    // Create a calendar event automatically for tentative bookings
    try {
      await prisma.event.create({
        data: {
          title: `Tentative: ${name} (${shootType})`,
          date: new Date(eventDate),
          type: 'Tentative',
          notes: `Lead generated via website form. City: ${city}. Venue: ${venue || 'Not specified'}. Enquiry ID: ${enquiryId}`,
          color: 'blue',
          leadId: newLead.id,
        },
      });
    } catch (calErr) {
      console.error('Failed to create calendar event for lead:', calErr);
    }

    return NextResponse.json(
      { success: true, enquiryId, leadId: newLead.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lead creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing booking' },
      { status: 500 }
    );
  }
}

// GET: List all leads (Protected Admin CRM)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        notes: true,
      },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Lead query API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve leads' }, { status: 500 });
  }
}
