import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Heart,
  Camera,
  Film,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Shield,
  Clock3,
  Users2,
  Tv,
  CheckCircle2,
  CalendarDays,
  FileSpreadsheet
} from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import FilmShowcase from "@/components/FilmShowcase";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FAQAccordion from "@/components/FAQAccordion";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

export const revalidate = 0; // Disable cache to reflect admin changes instantly

export default async function HomePage() {
  // Fetch site configurations
  let tagline = "Capture Your Love, Cherish Forever!";
  let phone = "+91 7999615949";
  let whatsapp = "+91 7999615949";
  let address = "Nanakheda, Ujjain, Madhya Pradesh";
  let timings = "Monday - Sunday: 10:00 AM - 8:00 PM";
  let serviceAreas = "";

  try {
    const sTagline = await prisma.setting.findUnique({ where: { key: "tagline" } });
    const sPhone = await prisma.setting.findUnique({ where: { key: "phone" } });
    const sWhatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
    const sAddress = await prisma.setting.findUnique({ where: { key: "address" } });
    const sTimings = await prisma.setting.findUnique({ where: { key: "timings" } });
    const sAreas = await prisma.setting.findUnique({ where: { key: "service_areas" } });

    if (sTagline?.value) tagline = sTagline.value;
    if (sPhone?.value) phone = sPhone.value;
    if (sWhatsapp?.value) whatsapp = sWhatsapp.value;
    if (sAddress?.value) address = sAddress.value;
    if (sTimings?.value) timings = sTimings.value;
    if (sAreas?.value) serviceAreas = sAreas.value;
  } catch (error) {
    console.error("Home settings loading error:", error);
  }

  // Fetch core entities
  let services: any[] = [];
  let portfolioProjects: any[] = [];
  let films: any[] = [];
  let testimonials: any[] = [];
  let faqs: any[] = [];
  let packages: any[] = [];

  try {
    services = await prisma.service.findMany({
      where: { enabled: true },
      orderBy: { displayOrder: "asc" },
      take: 6,
    });
    portfolioProjects = await prisma.portfolioProject.findMany({
      where: { draft: false, featured: true },
      orderBy: { date: "desc" },
      take: 3,
    });
    films = await prisma.weddingFilm.findMany({
      orderBy: { order: "asc" },
      take: 10,
    });
    testimonials = await prisma.testimonial.findMany({
      where: { approved: true, featured: true },
      take: 5,
    });
    packages = await prisma.package.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      take: 3,
    });

    // Query FAQs from Setting table
    const faqKeys = ["booking_time", "both_services", "travel", "deliverables_time"];
    const faqSettings = await prisma.setting.findMany({
      where: { key: { in: faqKeys } },
    });
    faqs = faqSettings.map((f) => JSON.parse(f.value));
  } catch (error) {
    console.error("Home entities loading error:", error);
  }

  // Set hero slides using featured portfolio items or static fallback
  const heroSlides = portfolioProjects.map((p) => ({
    image: p.coverImage,
    title: p.title,
  }));

  if (heroSlides.length === 0) {
    heroSlides.push({
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1920&auto=format&fit=crop",
      title: "Wedding Storytelling",
    });
  }

  // Structured Data Schema for Local Business
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Suramya Production",
    "image": heroSlides[0].image,
    "telephone": phone,
    "url": "https://suramyaproduction.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Front Nanakheda Bus Stand, Nanakheda",
      "addressLocality": "Ujjain",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "456010",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "23.158327",
      "longitude": "75.786962"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/suramya_production/",
      "https://www.facebook.com/saumitraphotography/"
    ]
  };

  return (
    <div className="flex flex-col w-full min-h-screen" suppressHydrationWarning={true}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Cinematic Hero Section */}
      <HeroSlideshow
        slides={heroSlides}
        eyebrow="Wedding Photography & Cinematography all over India"
        headline="Your Story Deserves to Be Remembered Beautifully."
        subheadline={`From quiet glances to unforgettable celebrations, Suramya Production transforms your most meaningful moments into photographs and films you will cherish for generations. ${tagline}`}
        trustline="Wedding • Pre-Wedding • Baby Shoot • Fashion • Cinematography"
      />

      {/* Trust and Positioning Strip */}
      <section className="bg-white border-y border-beige/40 py-8 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-4 text-charcoal/80 font-serif text-xs sm:text-sm tracking-widest uppercase">
          <span>Ujjain-Based Photography Team</span>
          <span className="text-gold">•</span>
          <span>Photography & Cinematography</span>
          <span className="text-gold">•</span>
          <span>Personalized Creative Direction</span>
          <span className="text-gold">•</span>
          <span>High-Resolution Delivery</span>
          <span className="text-gold">•</span>
          <span>Wedding Storytelling</span>
        </div>
      </section>

      {/* Signature Portfolio Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Our Masterpieces</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Stories We Have Had the Honour to Capture</h2>
          <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioProjects.map((project, idx) => (
            <div
              key={project.id}
              className={`group flex flex-col justify-between border border-beige/30 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                idx === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-beige/20 mb-5">
                <ImageWithSkeleton
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 font-serif text-[10px] tracking-wider uppercase text-charcoal">
                  {project.category}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-sans tracking-wider text-grey-secondary uppercase">
                  <span className="flex items-center gap-1"><MapPin size={10} />{project.location}</span>
                  <span>{new Date(project.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
                <h3 className="font-serif text-base tracking-wide text-charcoal group-hover:text-gold transition-colors">
                  {project.clientName}'s Wedding Story
                </h3>
                <p className="font-sans text-xs text-grey-secondary line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-block pt-3 font-serif text-xs tracking-wider uppercase text-gold hover:text-gold-dark transition-colors border-t border-beige/30 w-full"
                >
                  View Story →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-24">
          <Link
            href="/portfolio"
            className="inline-block px-8 py-3.5 border border-gold hover:bg-gold hover:text-ivory text-gold font-serif text-xs tracking-widest uppercase rounded-sm transition-all duration-300"
          >
            View Full Portfolio
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white border-y border-beige/30 py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Our Specialties</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Expertise Tailored to Your Occasions</h2>
            <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="group flex flex-col justify-between border border-beige/20 bg-ivory/30 p-5 rounded-sm hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-5 bg-beige">
                    <img
                      src={svc.featuredImage}
                      alt={svc.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                  </div>
                  <h3 className="font-serif text-base tracking-wide text-charcoal mb-3 group-hover:text-gold transition-colors">
                    {svc.name}
                  </h3>
                  <p className="font-sans text-xs text-grey-secondary leading-relaxed line-clamp-3 mb-4">
                    {svc.description}
                  </p>
                </div>
                <div className="space-y-4 pt-4 border-t border-beige/25">
                  <div className="text-[10px] text-grey-secondary">
                    <span className="font-medium text-charcoal uppercase block mb-1">What's Included:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {JSON.parse(svc.inclusions).slice(0, 2).map((inc: any, i: number) => (
                        <li key={i} className="truncate">{inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="flex-1 text-center py-2.5 border border-gold hover:bg-gold text-gold hover:text-ivory font-serif text-[9px] tracking-widest uppercase transition-all duration-300 rounded-none shadow-sm cursor-pointer"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/book?type=${encodeURIComponent(svc.name)}`}
                      className="flex-1 text-center py-2.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-[9px] tracking-widest uppercase transition-all duration-300 rounded-none shadow-sm cursor-pointer hover:tracking-[0.15em]"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Film Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Cinematic Films</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Relive the Feeling, Not Just the Event.</h2>
          <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
        </div>

        <FilmShowcase films={films} />
      </section>

      {/* Brand Story (Founder Message & Philosophy) */}
      <section className="bg-white border-y border-beige/30 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block">Our Philosophy</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal leading-snug">
              We Don't Simply Photograph Weddings. We Preserve Relationships, Rituals and Real Emotions.
            </h2>
            <p className="font-sans text-sm text-grey-secondary leading-relaxed font-light">
              At Suramya Production, every celebration is approached as a unique story. We focus on natural emotions, meaningful details, and the genuine connections that make your day unforgettable. Our goal is to create photographs and films that continue to feel deeply personal long after the celebration ends.
            </p>
            <blockquote className="border-l-2 border-gold pl-4 py-1 italic font-serif text-charcoal/80 text-sm">
              "We believe that real memories aren't posed. They are found in the silent tears of a father, the shared smile of a couple, and the chaotic joy of rituals."
            </blockquote>
            <div>
              <Link
                href="/about"
                className="inline-block px-8 py-4 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-widest uppercase transition-all duration-300 hover:tracking-[0.2em] shadow-sm rounded-none text-center"
                suppressHydrationWarning={true}
              >
                Meet Our Team
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageWithSkeleton
              src="/uploads/12.jpg"
              alt="Candid wedding prep shoot Ujjain"
              className="w-full aspect-[4/5] object-cover border border-beige shadow-sm"
            />
            <ImageWithSkeleton
              src="/uploads/13.jpg"
              alt="Beautiful bride portrait by Suramya Production"
              className="w-full aspect-[4/5] object-cover border border-beige shadow-sm"
              containerClassName="mt-8"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Our Standards</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Why Choose Suramya Production</h2>
          <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Emotion-First Storytelling",
              desc: "We focus on documenting real moments, capturing raw feelings, tears, and happiness rather than staged prompts.",
              icon: <Heart size={24} className="text-gold" />
            },
            {
              title: "Natural and Candid Moments",
              desc: "Our signatures are authentic expressions. We blend seamlessly into the crowd to capture family interactions organically.",
              icon: <Camera size={24} className="text-gold" />
            },
            {
              title: "Personalized Shoot Planning",
              desc: "We schedule comprehensive outfit and location consultations to align on your creative vision before the big day.",
              icon: <Sparkles size={24} className="text-gold" />
            },
            {
              title: "Combined Visual Team",
              desc: "Our photographers and cinematographers operate as one unified crew, eliminating spatial conflicts during ceremonies.",
              icon: <Film size={24} className="text-gold" />
            },
            {
              title: "Professional Editorial Editing",
              desc: "Every portrait is professionally color-graded and retouched to fit a timeless, magazine-like wedding layout.",
              icon: <Shield size={24} className="text-gold" />
            },
            {
              title: "Clear Communication & Timeline",
              desc: "No hidden costs. We provide clear deliverables and deliver your edited digital galleries within the agreed deadlines.",
              icon: <Clock3 size={24} className="text-gold" />
            }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-white border border-beige/35 rounded-sm hover:border-gold/30 transition-all duration-300">
              <div className="p-3 bg-ivory border border-beige/40 rounded-sm h-fit">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-base tracking-wide text-charcoal">{item.title}</h4>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white border-y border-beige/30 py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">The Journey</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">From First Conversation to Final Delivery</h2>
            <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
          </div>

          {/* Timeline Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
            {[
              { num: "01", step: "Share Your Date", desc: "Fill out our check availability form with your event details to confirm slot availability." },
              { num: "02", step: "Creative Consultation", desc: "We sit down (or connect via Zoom) to discuss your theme, style preferences, and rituals." },
              { num: "03", step: "Custom Package Planning", desc: "Select or structure a tailormade package. Secure your booking with an advance deposit." },
              { num: "04", step: "Photography & Filming", desc: "Our creative team handles the shoot using high-end gear and professional direction." },
              { num: "05", step: "Selection & Color Grading", desc: "You select your favorite frames via our secured client gallery, and our editors process them." },
              { num: "06", step: "Digital & Album Delivery", desc: "Receive your high-resolution digital files, wedding film, and printed albums on time." }
            ].map((p, idx) => (
              <div key={idx} className="relative flex flex-col justify-between p-5 border border-beige/30 bg-ivory/10 rounded-sm hover:bg-ivory/20 transition-all duration-300">
                <div>
                  <span className="font-serif text-2xl text-gold/30 block mb-2">{p.num}</span>
                  <h4 className="font-serif text-sm tracking-wide text-charcoal mb-2">{p.step}</h4>
                  <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Investments</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Featured Wedding Packages</h2>
          <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col justify-between bg-white border p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 ${
                pkg.featured ? "border-gold scale-103 z-10" : "border-beige/50"
              }`}
            >
              {pkg.badge && (
                <span className="absolute -top-3.5 left-6 bg-gold text-ivory px-3 py-1 font-serif text-[9px] tracking-widest uppercase rounded-sm">
                  {pkg.badge}
                </span>
              )}
              <div>
                <h3 className="font-serif text-lg tracking-wide text-charcoal">{pkg.name}</h3>
                <p className="font-sans text-xs text-grey-secondary mt-2 mb-6 font-light">{pkg.description}</p>
                
                <div className="mb-6 pb-6 border-b border-beige/30">
                  <span className="font-serif text-2xl text-gold">Request Quote</span>
                </div>

                <ul className="space-y-3.5 text-xs text-charcoal/80 mb-8 font-sans">
                  {JSON.parse(pkg.deliverables).map((item: any, idx: number) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href={`/book?package=${encodeURIComponent(pkg.name)}`}
                  className={`block w-full text-center py-4 font-serif text-[10px] tracking-widest uppercase transition-all duration-300 rounded-none shadow-sm ${
                    pkg.featured
                      ? "bg-gold hover:bg-gold-dark text-ivory hover:tracking-[0.2em]"
                      : "border border-gold hover:bg-gold hover:text-ivory text-gold"
                  }`}
                  suppressHydrationWarning={true}
                >
                  Book package
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="font-serif text-xs tracking-widest uppercase text-grey-secondary hover:text-gold transition-colors"
            suppressHydrationWarning={true}
          >
            Compare All Package Features & Add-ons →
          </Link>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="bg-white border-y border-beige/30 py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">Kind Words</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Stories of Love & Trust</h2>
            <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Local SEO & Services Locations Section */}
      {serviceAreas && (
        <section className="py-20 px-6 max-w-5xl mx-auto text-center w-full">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-3">Service Regions</span>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-4">
            Photography & Cinematography for Celebrations Across India
          </h3>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light mb-8 max-w-3xl mx-auto">
            Based at Nanakheda, we regularly cover weddings, pre-weddings, haldi-mehendi events, and family portfolios in areas such as Freeganj, Indore Road, Mahakal Lok Area, Dewas Road, and surrounding cities. Our team is fully equipped to travel to destination wedding venues across Madhya Pradesh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {serviceAreas.split(",").map((area, idx) => (
              <span
                key={idx}
                className="px-4 py-2 border border-beige/40 bg-white font-serif text-[11px] uppercase tracking-wider text-charcoal"
              >
                {area.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="bg-white border-y border-beige/30 py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block mb-2">FAQ</span>
            <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Frequently Asked Questions</h2>
            <div className="h-[1px] w-16 bg-gold/50 mx-auto mt-4" />
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="bg-charcoal text-ivory py-24 px-6 text-center relative overflow-hidden">
        {/* Soft Gold Blur Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">Reserve Your Date</span>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-wide leading-tight">Your Date Will Pass. The Memories Shouldn't.</h2>
          <p className="font-sans text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
            Tell us about your celebration, and let us create a visual story that still feels alive years from now. Bookings are open for the upcoming wedding season.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-widest uppercase transition-all duration-300 hover:tracking-[0.2em] shadow-sm rounded-none text-center"
              suppressHydrationWarning={true}
            >
              Check Availability
            </Link>
            <a
              href={`https://wa.me/${whatsapp.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent("Hello Suramya Production, I would like to check availability for my wedding.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-ivory/30 hover:border-gold hover:text-gold text-ivory font-serif text-[10px] tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-ivory rounded-none text-center"
              suppressHydrationWarning={true}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact and Location Strip */}
      <section className="bg-white py-16 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="font-serif text-xl text-charcoal">Suramya Production Studio</h3>
          <div className="space-y-4 text-sm font-sans text-grey-secondary font-light">
            <p className="flex items-center gap-3">
              <MapPin size={18} className="text-gold shrink-0" />
              <span>{address} (Location: Needs verification)</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-gold shrink-0" />
              <span>Call: {phone}</span>
            </p>
            <p className="flex items-center gap-3">
              <Clock size={18} className="text-gold shrink-0" />
              <span>Timings: {timings}</span>
            </p>
          </div>
          <div className="pt-4 border-t border-beige/40">
            <p className="text-xs text-grey-secondary leading-relaxed">
              Find us in front of the Nanakheda Bus Stand. Drop by to view our offline high-definition albums and discuss your event timeline in detail.
            </p>
          </div>
        </div>
        <div className="border border-beige/40 aspect-video w-full h-[250px] sm:h-auto rounded-sm overflow-hidden shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.1235122176465!2d75.7869622760655!3d22.158327179786443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396375aa4b8ad3f1%3A0xf63eb95c477beaa!2sNanakheda%2C%20Ujjain%2C%20Madhya%20Pradesh%20456010!5e0!3m2!1sen!2sin!4v1721600000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
