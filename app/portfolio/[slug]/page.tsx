import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import LightboxGallery from "@/components/LightboxGallery";
import { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
  });

  if (!project) return { title: "Story Not Found" };

  return {
    title: project.seoTitle || `${project.clientName}'s Wedding Story | Suramya Production`,
    description: project.seoDescription || project.description.slice(0, 155),
  };
}

export default async function ProjectStoryPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
  });

  if (!project || project.draft) {
    notFound();
  }

  // Parse photographs array
  let images: string[] = [];
  try {
    images = JSON.parse(project.photographs);
  } catch (error) {
    console.error("Failed to parse photographs JSON:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-grey-secondary hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Stories
        </Link>

        {/* Editorial Story Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12 border-b border-beige/40">
          <div className="lg:col-span-2 space-y-4">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block">
              {project.category} Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
              {project.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light max-w-3xl">
              {project.description}
            </p>
          </div>

          <div className="p-6 bg-white border border-beige/40 rounded-sm space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center py-2 border-b border-beige/20">
              <span className="text-grey-secondary uppercase tracking-wider">Client</span>
              <span className="text-charcoal font-medium">{project.clientName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-beige/20 text-xs">
              <span className="text-grey-secondary uppercase tracking-wider">Location</span>
              <span className="text-charcoal font-medium flex items-center gap-1">
                <MapPin size={12} />
                {project.location}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 text-xs">
              <span className="text-grey-secondary uppercase tracking-wider">Date</span>
              <span className="text-charcoal font-medium flex items-center gap-1">
                <Calendar size={12} />
                {new Date(project.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Masonry Lightbox Gallery */}
        <LightboxGallery images={images} />
      </div>
    </div>
  );
}
