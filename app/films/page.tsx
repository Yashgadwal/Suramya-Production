import { prisma } from "@/lib/prisma";
import FilmShowcase from "@/components/FilmShowcase";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Wedding Films & Reels | Suramya Production Ujjain",
  description: "Relive the emotions, rituals, and joy of our couples through our high-end cinematic wedding films, highlight teasers, and Instagram reels captured in Ujjain.",
};

export default async function WeddingFilmsPage() {
  let films: any[] = [];
  try {
    films = await prisma.weddingFilm.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to load wedding films:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Cinema Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Wedding Films
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            We don\'t just record events; we compose cinematic stories. Watch our collection of wedding highlight videos, vertical reels, and full length teasers.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Film Showcase Component */}
        <FilmShowcase films={films} />
      </div>
    </div>
  );
}
