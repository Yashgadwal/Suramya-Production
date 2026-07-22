import { prisma } from "@/lib/prisma";
import PortfolioGrid from "@/components/PortfolioGrid";
import { Metadata } from "next";

export const revalidate = 0; // Fresh content

export const metadata: Metadata = {
  title: "Wedding Portfolio | Suramya Production Ujjain",
  description: "Browse through our collection of premium wedding stories, pre-wedding memories, candid photography galleries, and cinematic films captured in Ujjain.",
};

export default async function PortfolioPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.portfolioProject.findMany({
      where: { draft: false },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Failed to load portfolio projects:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Love Stories
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            The Portfolio
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            Every couple is unique, and so is their celebration. Browse through the moments, rituals, and real emotions we have had the honour of capturing.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Filterable Grid Component */}
        <PortfolioGrid projects={projects} />
      </div>
    </div>
  );
}
