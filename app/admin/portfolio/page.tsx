import { prisma } from "@/lib/prisma";
import PortfolioCMS from "@/components/PortfolioCMS";
import { Metadata } from "next";

export const revalidate = 0; // Fresh content

export const metadata: Metadata = {
  title: "Portfolio CMS | Suramya Dashboard",
};

export default async function AdminPortfolioPage() {
  let projects: any[] = [];

  try {
    projects = await prisma.portfolioProject.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Failed to load portfolio projects in CMS page:", error);
  }

  // Format dates strictly to YYYY-MM-DD for serialization safety on client components
  const serializedProjects = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    coverImage: p.coverImage,
    clientName: p.clientName,
    category: p.category,
    location: p.location,
    date: p.date.toISOString().split("T")[0],
    description: p.description,
    photographs: p.photographs,
    featured: p.featured,
    draft: p.draft,
  }));

  return <PortfolioCMS initialProjects={serializedProjects} />;
}
