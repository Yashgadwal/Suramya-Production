'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  image: string;
  title: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
  eyebrow: string;
  headline: string;
  subheadline: string;
  trustline: string;
}

export default function HeroSlideshow({
  slides,
  eyebrow,
  headline,
  subheadline,
  trustline,
}: HeroSlideshowProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlides = slides.length > 0 ? slides : [
    {
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1920&auto=format&fit=crop',
      title: 'Suramya Production'
    }
  ];

  return (
    <div className="relative w-full h-[90vh] min-h-[500px] sm:h-[95vh] flex items-center justify-center overflow-hidden bg-charcoal" suppressHydrationWarning={true}>
      {/* Background Slideshow */}
      {activeSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIdx ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            transitionProperty: 'opacity, transform',
            transitionDuration: '1.5s, 6s',
          }}
          suppressHydrationWarning={true}
        />
      ))}

      {/* Luxury Soft Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/45 to-charcoal/20" suppressHydrationWarning={true} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 sm:pt-0 text-center text-ivory flex flex-col items-center justify-center">
        {/* Eyebrow */}
        <span className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold mb-4 sm:mb-6 animate-fade-in">
          {eyebrow}
        </span>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl tracking-wide leading-tight sm:leading-snug max-w-3xl mb-4 sm:mb-6">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-sm sm:text-base text-ivory/80 max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0">
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mb-8 sm:mb-12">
          <Link
            href="/book"
            className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-widest uppercase transition-all duration-300 hover:tracking-[0.2em] shadow-sm rounded-none text-center"
          >
            Check Your Date
          </Link>
          <Link
            href="/portfolio"
            className="w-full sm:w-auto px-8 py-4 border border-ivory/40 hover:border-gold hover:bg-gold hover:text-ivory text-ivory font-serif text-[10px] tracking-widest uppercase transition-all duration-300 rounded-none text-center"
          >
            Explore Our Stories
          </Link>
        </div>

        {/* Trust Line */}
        <div className="border-t border-ivory/10 pt-4 sm:pt-6 w-full max-w-lg">
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-ivory/60 font-light">
            {trustline}
          </p>
        </div>
      </div>
    </div>
  );
}
