import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Heart, Camera, Film, Users, Award, ShieldCheck } from "lucide-react";
import { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | Suramya Production Ujjain",
  description: "Learn about the team behind Suramya Production in Ujjain. Our approach, vision, and founder Saumitra's message on preserving wedding rituals and emotions.",
};

export default async function AboutPage() {
  let businessName = "Suramya Production";
  let address = "Nanakheda, Ujjain, Madhya Pradesh";

  try {
    const sName = await prisma.setting.findUnique({ where: { key: "business_name" } });
    const sAddress = await prisma.setting.findUnique({ where: { key: "address" } });
    if (sName?.value) businessName = sName.value;
    if (sAddress?.value) address = sAddress.value;
  } catch (error) {
    console.error("About page settings load error:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Intro Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
              Our Story
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-charcoal leading-tight">
              Preserving Relationships, Rituals and Real Emotions
            </h1>
            <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
              Founded in Ujjain, {businessName} was born out of a desire to break away from generic, heavily posed wedding photography. We believe that a wedding day is not a photoshoot; it is a sacred boundary of family rituals, unexpected laughter, and quiet emotional moments.
            </p>
            <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
              Over the years, our dedicated team of candid photographers, drone pilots, and editors have documented hundreds of celebrations, refining our luxury editorial aesthetic that feels authentic and looks premium.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-beige overflow-hidden border border-beige/40 rounded-sm">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop"
              alt="Suramya Production photography team on location"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Philosophy Strip */}
        <div className="bg-white border-y border-beige/30 py-16 px-6 sm:px-12 text-center rounded-sm max-w-4xl mx-auto space-y-6 shadow-sm">
          <h2 className="font-serif text-2xl text-charcoal">"We photograph the feeling, not just the event."</h2>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light max-w-2xl mx-auto">
            Our creative direction is gentle and unobtrusive. We guide you where necessary to capture beautiful lighting, but step back during rituals to let the real emotions flow naturally. This balance is what gives our stories their timeless, classic character.
          </p>
        </div>

        {/* Meet the Founder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] max-w-md mx-auto bg-beige overflow-hidden border border-beige/40 rounded-sm shadow-sm lg:order-last">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
              alt="Saumitra - Founder & Lead Photographer of Suramya Production"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block">
              Founder's Message
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
              A Message from Saumitra
            </h2>
            <blockquote className="italic font-serif text-charcoal/80 text-sm leading-relaxed border-l-2 border-gold pl-4 py-1">
              "When you look back at your wedding album twenty years from now, I don\'t want you to just remember how you looked. I want you to remember exactly how you felt. That is the standard we hold ourselves to at Suramya Production."
            </blockquote>
            <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
              "We have built our studio in Nanakheda, Ujjain, to provide local couples with a world-class photography experience. We handle every wedding as if it were a member of our own family, with patience, creativity, and absolute professional commitment."
            </p>
            <div className="pt-4">
              <p className="font-serif text-sm tracking-wide text-charcoal">Saumitra Suramya</p>
              <p className="font-sans text-[10px] tracking-widest text-gold uppercase">Founder & Lead Creative Director</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase rounded-sm shadow-sm transition-all duration-300"
          >
            Work With Us
          </Link>
        </div>
      </div>
    </div>
  );
}
