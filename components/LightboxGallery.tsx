'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface LightboxGalleryProps {
  images: string[];
  allowDownload?: boolean;
}

export default function LightboxGallery({ images, allowDownload = true }: LightboxGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev !== null ? (prev + 1) % images.length : null));
  };

  // Mobile Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext(); // swipe left
    } else if (diff < -50) {
      handlePrev(); // swipe right
    }
    setTouchStart(null);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-beige rounded-sm">
        <p className="text-sm text-grey-secondary font-serif">No images added to this story yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Responsive Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="masonry-item break-inside-avoid relative overflow-hidden bg-beige/10 border border-beige/20 rounded-sm cursor-pointer group mb-6"
          >
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-102"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-4 py-2 bg-white/90 text-charcoal font-serif text-[10px] tracking-widest uppercase rounded-sm shadow-md">
                View Frame
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-charcoal/95 backdrop-blur-md p-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Controls */}
          <div className="flex justify-between items-center w-full z-10 py-2">
            <span className="text-xs font-sans tracking-widest text-ivory/60 uppercase">
              Frame {activeIdx + 1} of {images.length}
            </span>
            <div className="flex items-center space-x-4">
              {allowDownload && (
                <a
                  href={images[activeIdx]}
                  download={`suramya_frame_${activeIdx + 1}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-ivory/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="Download Image"
                >
                  <Download size={20} />
                </a>
              )}
              <button
                onClick={() => setActiveIdx(null)}
                className="p-2 text-ivory/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image Container with Prev/Next buttons */}
          <div className="relative flex-grow flex items-center justify-center max-h-[80vh]">
            {/* Prev Trigger */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 p-3 bg-charcoal/40 hover:bg-charcoal/70 text-ivory rounded-full transition-all focus:outline-none z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <img
              src={images[activeIdx]}
              alt={`Full size frame ${activeIdx + 1}`}
              className="max-w-full max-h-full object-contain select-none shadow-2xl"
              onContextMenu={(e) => {
                if (!allowDownload) e.preventDefault(); // Prevent right click save
              }}
            />

            {/* Next Trigger */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 p-3 bg-charcoal/40 hover:bg-charcoal/70 text-ivory rounded-full transition-all focus:outline-none z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bottom Caption Overlay */}
          <div className="w-full text-center py-4 z-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ivory/40">
              Suramya Production • Captured in High Definition
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
