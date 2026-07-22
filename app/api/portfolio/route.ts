import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: List all projects (Public / Admin depending on draft status)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('drafts') === 'true';

    // If drafts are requested, verify session
    if (includeDrafts) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const projects = await prisma.portfolioProject.findMany({
      where: includeDrafts ? {} : { draft: false },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

// POST: Create or Update a project (Protected Admin)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin' && session.role !== 'Content Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      slug,
      coverImage,
      clientName,
      category,
      location,
      date,
      description,
      photographs,
      videos,
      featured,
      draft,
      seoTitle,
      seoDescription,
    } = body;

    if (!title || !slug || !coverImage || !clientName || !category || !location || !date) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const parsedPhotos = Array.isArray(photographs) 
      ? JSON.stringify(photographs) 
      : photographs || '[]';
      
    const parsedVideos = Array.isArray(videos) 
      ? JSON.stringify(videos) 
      : videos || '[]';

    const projectData = {
      title,
      slug,
      coverImage,
      clientName,
      category,
      location,
      date: new Date(date),
      description: description || '',
      photographs: parsedPhotos,
      videos: parsedVideos,
      featured: !!featured,
      draft: !!draft,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    let project;
    if (id) {
      // Update
      project = await prisma.portfolioProject.update({
        where: { id },
        data: projectData,
      });
    } else {
      // Create new
      project = await prisma.portfolioProject.create({
        data: projectData,
      });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Portfolio save error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A project with this URL slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save portfolio project' }, { status: 500 });
  }
}

// DELETE: Delete a project (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.portfolioProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete portfolio project' }, { status: 500 });
  }
}
