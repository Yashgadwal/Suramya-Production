import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://suramyaproduction.com';

  // Fetch dynamic slugs from database
  let servicesSlugs: string[] = [];
  let portfolioSlugs: string[] = [];
  let blogSlugs: string[] = [];

  try {
    const services = await prisma.service.findMany({
      where: { enabled: true },
      select: { slug: true }
    });
    servicesSlugs = services.map(s => s.slug);
  } catch (e) {
    console.error('Sitemap services query error:', e);
  }

  try {
    const portfolio = await prisma.portfolioProject.findMany({
      where: { draft: false },
      select: { slug: true }
    });
    portfolioSlugs = portfolio.map(p => p.slug);
  } catch (e) {
    console.error('Sitemap portfolio query error:', e);
  }

  try {
    const blogs = await prisma.blogPost.findMany({
      where: { draft: false },
      select: { slug: true }
    });
    blogSlugs = blogs.map(b => b.slug);
  } catch (e) {
    console.error('Sitemap blogs query error:', e);
  }

  // Map static main pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/portfolio',
    '/services',
    '/films',
    '/packages',
    '/book',
    '/privacy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Map dynamic service detail pages
  const serviceRoutes = servicesSlugs.map(slug => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Map dynamic portfolio item detail pages
  const portfolioRoutes = portfolioSlugs.map(slug => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Map dynamic blog post pages
  const blogRoutes = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
}
