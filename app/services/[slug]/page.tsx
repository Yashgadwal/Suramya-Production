import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, MessageSquare, Calendar, Phone } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) return { title: "Service Not Found" };

  return {
    title: service.seoTitle || `${service.name} in Ujjain | Suramya Production`,
    description: service.seoDescription || service.description.slice(0, 155),
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service || !service.enabled) {
    notFound();
  }

  // Parse inclusions JSON
  let inclusions: string[] = [];
  try {
    inclusions = JSON.parse(service.inclusions);
  } catch (error) {
    console.error("Failed to parse inclusions:", error);
  }

  // Fetch related portfolio stories matching this service
  let categoryMap: Record<string, string> = {
    "wedding-photography": "Wedding",
    "wedding-cinematography": "Wedding",
    "pre-wedding-shoot": "Pre-Wedding",
    "baby-maternity-shoot": "Baby",
  };

  const projectCategory = categoryMap[service.slug] || "Wedding";
  let relatedStories: any[] = [];

  try {
    relatedStories = await prisma.portfolioProject.findMany({
      where: { category: projectCategory, draft: false },
      orderBy: { date: "desc" },
      take: 2,
    });
  } catch (error) {
    console.error("Failed to load related stories:", error);
  }

  // Fetch contact details from settings for WhatsApp link
  let whatsapp = "+917999615949";
  let phone = "+917999615949";
  try {
    const sWhatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
    const sPhone = await prisma.setting.findUnique({ where: { key: "phone" } });
    if (sWhatsapp?.value) whatsapp = sWhatsapp.value.replace(/\s+/g, '').replace('+', '');
    if (sPhone?.value) phone = sPhone.value.replace(/\s+/g, '');
  } catch (error) {
    console.error("Failed to load contact settings:", error);
  }

  const encodedMsg = encodeURIComponent(`Hello Suramya Production, I am interested in your ${service.name} service.`);

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-grey-secondary hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Services
        </Link>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block">
              Professional Service
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal tracking-wide">
              {service.name}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
              {service.description}
            </p>
            <div className="p-4 bg-white border border-beige/40 rounded-sm">
              <span className="font-sans text-[10px] font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Perfect For:
              </span>
              <p className="font-sans text-xs text-grey-secondary italic leading-relaxed font-light">
                {service.customerType}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`/book?type=${encodeURIComponent(service.name)}`}
                className="flex-1 text-center py-4 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-wider uppercase transition-colors rounded-sm shadow-sm"
              >
                Check Date Availability
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodedMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-4 border border-gold hover:text-gold-dark text-gold font-serif text-xs tracking-wider uppercase transition-colors rounded-sm"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden aspect-[4/3] bg-beige rounded-sm shadow-sm">
            <img
              src={service.featuredImage}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* What is included section */}
        <div className="bg-white border border-beige/40 p-8 sm:p-12 rounded-sm shadow-sm">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal mb-8 text-center">
            What is Included in Our {service.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start p-4 bg-ivory/20 border border-beige/20 rounded-sm">
                <CheckCircle className="text-gold shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <h4 className="font-serif text-xs sm:text-sm text-charcoal font-semibold tracking-wide">
                    Detail 0{idx + 1}
                  </h4>
                  <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Stories section */}
        {relatedStories.length > 0 && (
          <div className="space-y-8">
            <h2 className="font-serif text-xl sm:text-2xl text-charcoal text-center">
              Featured {projectCategory} Stories We Have Captured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/portfolio/${story.slug}`}
                  className="group flex flex-col border border-beige/30 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-beige/20 mb-4">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                  </div>
                  <h3 className="font-serif text-sm sm:text-base tracking-wide text-charcoal group-hover:text-gold transition-colors">
                    {story.title}
                  </h3>
                  <p className="font-sans text-xs text-grey-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
