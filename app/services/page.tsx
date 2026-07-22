import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Camera, Film, Heart, Sparkles, Star, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Photography Services in Ujjain | Suramya Production",
  description: "Explore our professional photography and cinematography services in Ujjain, including wedding films, candid photography, pre-wedding shoots, and baby shoots.",
};

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to load services:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            What We Do
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Our Creative Services
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            We offer professional visual storytelling solutions for weddings, events, and commercial projects across Ujjain and Madhya Pradesh. Explore our specialized services.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Services List Layout */}
        <div className="space-y-16">
          {services.map((svc, idx) => {
            const inclusions = JSON.parse(svc.inclusions);
            const isEven = idx % 2 === 0;

            return (
              <div
                key={svc.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border border-beige/40 bg-white p-6 sm:p-10 rounded-sm shadow-sm transition-all duration-300 hover:shadow-md ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Visual Side */}
                <div className={`relative overflow-hidden aspect-[4/3] bg-beige ${isEven ? "" : "lg:order-last"}`}>
                  <img
                    src={svc.featuredImage}
                    alt={svc.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  />
                </div>

                {/* Content Side */}
                <div className="space-y-6">
                  <span className="font-serif text-gold text-lg font-light tracking-wide">
                    Service 0{idx + 1}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-wide">
                    {svc.name}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
                    {svc.description}
                  </p>

                  <div className="space-y-2">
                    <span className="font-sans text-[10px] sm:text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      Suitable For:
                    </span>
                    <p className="font-sans text-xs text-grey-secondary italic font-light">
                      {svc.customerType}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="font-sans text-[10px] sm:text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      What's Included:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-charcoal/80">
                      {inclusions.map((inc: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center">
                          <CheckCircle size={12} className="text-gold shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-beige/30">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-center px-6 py-3 border border-gold hover:bg-gold hover:text-ivory text-gold font-serif text-xs tracking-wider uppercase transition-all duration-300"
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/book?type=${encodeURIComponent(svc.name)}`}
                      className="text-center px-6 py-3 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-wider uppercase transition-all duration-300"
                    >
                      Enquire Availability
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local SEO Segment */}
        <div className="bg-white border border-beige/40 p-8 rounded-sm text-center max-w-4xl mx-auto space-y-4 shadow-sm">
          <h3 className="font-serif text-lg tracking-wide text-charcoal">
            Ujjain Local Photography Studio Specialists
          </h3>
          <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
            Suramya Production is Ujjain's trusted local photography studio in Nanakheda, specializing in premium wedding films, pre-wedding couple shoots, candid rituals coverage, and baby milestone portraits. We capture visual legacies that preserve real relationships and emotions.
          </p>
        </div>
      </div>
    </div>
  );
}
