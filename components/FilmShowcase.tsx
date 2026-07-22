'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';

interface Film {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  description: string | null;
  isVertical: boolean;
}

interface FilmShowcaseProps {
  films: Film[];
}

export default function FilmShowcase({ films }: FilmShowcaseProps) {
  const [activeFilmUrl, setActiveFilmUrl] = useState<string | null>(null);

  const horizontalFilms = films.filter((f) => !f.isVertical);
  const verticalReels = films.filter((f) => f.isVertical);

  // Fallback films if none seeded
  const activeHoriz = horizontalFilms.length > 0 ? horizontalFilms : [
    {
      id: 'f-1',
      title: 'A Tale of Love: Devashish & Riya',
      url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      description: 'Highlight film capturing their royal traditional wedding ceremonies in Ujjain.',
      isVertical: false
    }
  ];

  const activeVert = verticalReels.length > 0 ? verticalReels : [
    {
      id: 'v-1',
      title: 'Haldi Joy Reel',
      url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop',
      description: 'Joyful yellow splashes',
      isVertical: true
    },
    {
      id: 'v-2',
      title: 'Bridal Reveal',
      url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=400&auto=format&fit=crop',
      description: 'Classic editorial portrait',
      isVertical: true
    }
  ];

  return (
    <div className="space-y-12">
      {/* Horizontal Cinematic Films */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeHoriz.map((film) => (
          <div
            key={film.id}
            className="group relative cursor-pointer overflow-hidden border border-beige/30 bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => setActiveFilmUrl(film.url)}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={film.thumbnail}
                alt={film.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                <span className="p-4 bg-white/90 group-hover:bg-gold text-charcoal group-hover:text-ivory rounded-full shadow-lg transition-colors duration-300 transform group-hover:scale-110">
                  <Play size={20} className="fill-current pl-0.5" />
                </span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-serif text-sm sm:text-base tracking-wide text-charcoal group-hover:text-gold transition-colors duration-300">
                {film.title}
              </h4>
              {film.description && (
                <p className="font-sans text-xs text-grey-secondary mt-1 line-clamp-2">
                  {film.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Reels Strip */}
      <div>
        <h4 className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase text-grey-secondary mb-6 text-center">
          Instagram & Short Reels
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {activeVert.map((reel) => (
            <div
              key={reel.id}
              className="group relative cursor-pointer overflow-hidden border border-beige/30 bg-white rounded-sm aspect-[9/16] shadow-sm"
              onClick={() => setActiveFilmUrl(reel.url)}
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
                <span className="p-3 bg-white/90 group-hover:bg-gold text-charcoal group-hover:text-ivory rounded-full shadow-md transition-all duration-300">
                  <Play size={14} className="fill-current pl-0.5" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-serif text-xs tracking-wide line-clamp-1">{reel.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Lightbox Player */}
      <VideoModal
        isOpen={!!activeFilmUrl}
        videoUrl={activeFilmUrl || ''}
        onClose={() => setActiveFilmUrl(null)}
      />
    </div>
  );
}
