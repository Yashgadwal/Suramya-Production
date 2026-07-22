import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Check, CheckCircle2, XCircle, Info } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Wedding Photography Packages Ujjain | Suramya Production",
  description: "View prices, deliverables, and features of our wedding photography, pre-wedding couple shoots, and custom cinematography packages in Ujjain.",
};

export default async function PackagesPage() {
  let packages: any[] = [];
  try {
    packages = await prisma.package.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to load packages:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Pricing Plans
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Investment & Packages
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            We offer transparent packages designed to suit different scales of celebrations. Pricing is open to custom configurations based on your event timeline.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const deliverables = JSON.parse(pkg.deliverables);
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between bg-white border p-6 sm:p-8 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 ${
                  pkg.featured ? "border-gold scale-103 z-10" : "border-beige/50"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-6 bg-gold text-ivory px-3 py-1 font-serif text-[9px] tracking-widest uppercase rounded-sm">
                    {pkg.badge}
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-xl tracking-wide text-charcoal">{pkg.name}</h3>
                  <p className="font-sans text-xs text-grey-secondary mt-2 mb-6 leading-relaxed font-light">
                    {pkg.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-beige/30">
                    {pkg.price ? (
                      <div>
                        <span className="text-[9px] uppercase text-grey-secondary tracking-widest block font-sans">
                          {pkg.priceType}
                        </span>
                        <span className="font-serif text-3xl sm:text-4xl text-gold">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-serif text-2xl text-gold">Request Quote</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3.5 text-xs text-charcoal/80 mb-8 font-sans">
                    {deliverables.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />
                        <span className="leading-tight font-light">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Highlights Spec box */}
                  <div className="border-t border-beige/30 pt-6 mt-6 space-y-2 text-[11px] font-sans text-grey-secondary">
                    <div className="flex justify-between">
                      <span>Event Coverage Time</span>
                      <span className="text-charcoal font-medium">{pkg.hoursCovered ? `${pkg.hoursCovered} Hours` : "As per functions"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Photographers</span>
                      <span className="text-charcoal font-medium">{pkg.photographersCount} Lead</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cinematographers</span>
                      <span className="text-charcoal font-medium">{pkg.videographersCount} Lead</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aerial Drone Coverage</span>
                      <span className="text-charcoal font-medium">{pkg.droneEnabled ? "Included" : "Add-on"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wedding Albums</span>
                      <span className="text-charcoal font-medium">{pkg.albumsCount > 0 ? `${pkg.albumsCount} Premium Album` : "Digital only"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Timeline</span>
                      <span className="text-charcoal font-medium">{pkg.deliveryWeeks} Weeks</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/book?package=${encodeURIComponent(pkg.name)}`}
                    className={`block w-full text-center py-3.5 font-serif text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                      pkg.featured
                        ? "bg-gold hover:bg-gold-dark text-ivory shadow-md"
                        : "border border-gold hover:bg-gold hover:text-ivory text-gold"
                    }`}
                  >
                    Select package
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quote segment */}
        <div className="max-w-4xl mx-auto bg-white border border-beige/40 p-8 sm:p-12 rounded-sm shadow-sm text-center space-y-6">
          <div className="p-3 bg-ivory border border-beige/35 rounded-full w-fit mx-auto">
            <Info size={24} className="text-gold" />
          </div>
          <h2 className="font-serif text-2xl text-charcoal">Need a Custom Celebration Package?</h2>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light max-w-2xl mx-auto">
            Do you plan a single-day event, multiple destination rituals, or want to add customized deliverables like same-day edits, live streaming, or extra leather albums? Let's discuss your timeline to formulate a custom quotation.
          </p>
          <div>
            <Link
              href="/book"
              className="inline-block px-8 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase rounded-sm shadow-sm transition-all duration-300"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
