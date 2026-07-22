import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientGalleryWorkspace from "@/components/ClientGalleryWorkspace";
import { Metadata } from "next";
import { Lock } from "lucide-react";

export const revalidate = 0; // Fresh updates

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await prisma.clientGallery.findUnique({
    where: { slug },
  });

  if (!gallery) return { title: "Private Gallery" };

  return {
    title: `${gallery.name} | Private Secured Access`,
    robots: "noindex, nofollow", // Prevent private client galleries from indexing on search engine crawlers
  };
}

export default async function ClientGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const gallery = await prisma.clientGallery.findUnique({
    where: { slug },
    include: {
      media: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!gallery) {
    notFound();
  }

  // Verify expiry date
  if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
    return (
      <div className="py-24 px-6 bg-ivory text-center flex items-center justify-center min-h-[60vh] font-sans">
        <div className="max-w-md w-full bg-white border border-beige/40 p-8 sm:p-10 rounded-sm shadow-sm space-y-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full w-fit mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="font-serif text-xl text-charcoal">Gallery Access Expired</h2>
          <p className="text-xs text-grey-secondary leading-relaxed font-light">
            This private client gallery has expired. Please contact the studio representative at Suramya Production to extend your viewing access.
          </p>
        </div>
      </div>
    );
  }

  // Format dates before passing to client components
  const serializedGallery = {
    id: gallery.id,
    name: gallery.name,
    password: gallery.password,
    expiresAt: gallery.expiresAt ? gallery.expiresAt.toISOString() : null,
    allowDownload: gallery.allowDownload,
    watermarkText: gallery.watermarkText,
    media: gallery.media.map((m) => ({
      id: m.id,
      url: m.url,
      alt: m.alt,
      isFavorite: m.isFavorite,
    })),
  };

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <ClientGalleryWorkspace gallery={serializedGallery} />
      </div>
    </div>
  );
}
