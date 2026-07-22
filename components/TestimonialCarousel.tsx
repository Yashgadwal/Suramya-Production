'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  type: string;
  review: string;
  rating: number;
  sourceUrl: string | null;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIdx];

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-12 bg-white border border-beige/40 rounded-sm shadow-sm">
      <div className="absolute top-6 left-6 text-gold/15">
        <Quote size={56} className="fill-gold/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Rating Stars */}
        <div className="flex space-x-1 mb-6">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={18}
              className={`${
                idx < current.rating
                  ? 'text-gold fill-gold'
                  : 'text-grey-secondary/20'
              }`}
            />
          ))}
        </div>

        {/* Review Content */}
        <p className="font-serif text-base sm:text-xl text-charcoal italic leading-relaxed max-w-3xl mb-8">
          "{current.review}"
        </p>

        {/* Client details */}
        <div className="flex items-center space-x-4">
          {current.avatar && (
            <img
              src={current.avatar}
              alt={current.name}
              className="w-12 h-12 rounded-full object-cover border border-beige"
            />
          )}
          <div className="text-left">
            <h4 className="font-serif text-sm tracking-widest uppercase text-charcoal">
              {current.name}
            </h4>
            <span className="text-[10px] tracking-widest uppercase text-grey-secondary font-sans font-light">
              {current.type}
            </span>
          </div>
        </div>

        {/* Source link */}
        {current.sourceUrl && (
          <a
            href={current.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-[10px] tracking-wider text-gold uppercase hover:underline"
          >
            Verified Review
          </a>
        )}
      </div>

      {/* Nav Controls */}
      {testimonials.length > 1 && (
        <div className="flex justify-center items-center space-x-8 mt-10">
          <button
            onClick={handlePrev}
            className="p-2 border border-beige hover:border-gold hover:text-gold rounded-full transition-colors focus:outline-none"
            aria-label="Previous review"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-sans text-grey-secondary tracking-widest">
            {currentIdx + 1} / {testimonials.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 border border-beige hover:border-gold hover:text-gold rounded-full transition-colors focus:outline-none"
            aria-label="Next review"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
