import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET: Retrieve blogs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('drafts') === 'true';

    if (includeDrafts) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const posts = await prisma.blogPost.findMany({
      where: includeDrafts ? {} : { draft: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST: Create or Update blog post (Protected Admin)
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
      content,
      coverImage,
      category,
      tags,
      author,
      draft,
      seoTitle,
      seoDescription,
      readingTime,
    } = body;

    if (!title || !slug || !content || !coverImage || !category) {
      return NextResponse.json({ error: 'Missing required blog fields' }, { status: 400 });
    }

    const blogData = {
      title,
      slug,
      content,
      coverImage,
      category,
      tags: tags || '',
      author: author || 'Suramya Team',
      draft: !!draft,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      readingTime: readingTime ? parseInt(readingTime) : Math.max(1, Math.round(content.split(/\s+/).length / 200)),
    };

    let post;
    if (id) {
      post = await prisma.blogPost.update({
        where: { id },
        data: blogData,
      });
    } else {
      post = await prisma.blogPost.create({
        data: blogData,
      });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Blog post save error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this URL slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

// DELETE: Delete a blog post (Protected Admin)
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'Super Admin' && session.role !== 'Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
