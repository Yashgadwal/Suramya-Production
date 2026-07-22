import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH: Update lead status, notes, or finance (Protected Admin)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, quotedAmount, advancePaid, remainingDue, noteContent } = body;

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Build update object
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (quotedAmount !== undefined) updateData.quotedAmount = parseFloat(quotedAmount);
    if (advancePaid !== undefined) updateData.advancePaid = parseFloat(advancePaid);
    if (remainingDue !== undefined) updateData.remainingDue = parseFloat(remainingDue);

    // Save lead update
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    // If noteContent is provided, add to notes list
    if (noteContent) {
      await prisma.leadNote.create({
        data: {
          leadId: id,
          content: noteContent,
          createdBy: session.username,
        },
      });
    }

    // Synchronize event conflicts if booked
    if (status === 'Booked') {
      try {
        await prisma.event.updateMany({
          where: { leadId: id },
          data: {
            title: `CONFIRMED: ${existingLead.name} (${existingLead.shootType})`,
            type: 'Booking',
            color: 'gold', // Gold signifies confirmed bookings
          },
        });
      } catch (calErr) {
        console.error('Failed to sync calendar status on Booking:', calErr);
      }
    }

    return NextResponse.json(updatedLead);
  } catch (error: any) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE: Delete lead permanently (Protected Admin)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Deletes cascades notes automatically as defined in prisma relation
    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted permanently' });
  } catch (error: any) {
    console.error('Lead deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
