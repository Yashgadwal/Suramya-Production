'use client';

import { useState } from 'react';
import { Lock, Heart, Download, Eye, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Media {
  id: string;
  url: string;
  alt: string | null;
  isFavorite: boolean;
}

interface Gallery {
  id: string;
  name: string;
  password: string;
  expiresAt: string | null;
  allowDownload: boolean;
  watermarkText: string | null;
  media: Media[];
}

interface ClientGalleryWorkspaceProps {
  gallery: Gallery;
}

export default function ClientGalleryWorkspace({ gallery }: ClientGalleryWorkspaceProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [galleryMedia, setGalleryMedia] = useState<Media[]>(gallery.media);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === gallery.password) {
      setIsAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Incorrect gallery password/PIN. Please check your invitation link.');
    }
  };

  const handleToggleFavorite = async (mediaId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setGalleryMedia((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, isFavorite: nextStatus } : m))
    );

    try {
      const res = await fetch('/api/gallery/favorite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, isFavorite: nextStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch (error) {
      // Revert optimistic update on error
      setGalleryMedia((prev) =>
        prev.map((m) => (m.id === mediaId ? { ...m, isFavorite: currentStatus } : m))
      );
      alert('Failed to save choice.');
    }
  };

  // Password Lock view
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full bg-white border border-beige/40 p-8 sm:p-10 rounded-sm shadow-md space-y-6 text-center">
          <div className="p-3 bg-ivory border border-beige/45 rounded-full w-fit mx-auto text-gold">
            <Lock size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl tracking-wide text-charcoal">{gallery.name}</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest">
              Private Secured client Gallery
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-[11px] p-3 border-l-2 border-red-500 rounded-r-sm text-left">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerifyPassword} className="space-y-4 text-xs text-left">
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Enter Password / PIN</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter invitation passcode"
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10 font-mono text-center tracking-widest text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer shadow-sm"
            >
              Verify Passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  const favoritesCount = galleryMedia.filter((m) => m.isFavorite).length;

  return (
    <div className="space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-beige/40 rounded-sm shadow-xs">
        <div>
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold block mb-1">
            Exclusive Client Access
          </span>
          <h1 className="font-serif text-2xl text-charcoal">{gallery.name}</h1>
          <p className="text-gray-400 text-[10px] mt-0.5">
            Mark your favorites by clicking the heart. We will receive your selection automatically.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-ivory/40 px-4 py-2 border border-beige/30 rounded-sm">
          <Heart size={16} className="text-red-500 fill-red-500" />
          <span className="font-medium text-xs text-charcoal">
            {favoritesCount} Favorites Selected
          </span>
        </div>
      </div>

      {/* Grid gallery */}
      {galleryMedia.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-beige/60 rounded-sm bg-white">
          <p className="font-serif text-sm text-gray-400 tracking-widest">
            No photographs have been uploaded to this gallery yet.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
          {galleryMedia.map((photo) => (
            <div
              key={photo.id}
              className="masonry-item break-inside-avoid relative overflow-hidden bg-white border border-beige/30 rounded-sm shadow-xs group mb-6"
            >
              {/* Image box with context block prevent */}
              <div className="relative w-full h-auto select-none">
                <img
                  src={photo.url}
                  alt={photo.alt || 'Client photograph'}
                  className="w-full h-auto object-cover"
                  onContextMenu={(e) => {
                    if (!gallery.allowDownload) e.preventDefault();
                  }}
                />

                {/* Subtle watermark overlay if configured */}
                {gallery.watermarkText && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
                    <span className="text-white/15 font-serif text-2xl tracking-[0.3em] uppercase rotate-45 select-none select-none font-bold">
                      {gallery.watermarkText}
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Actions Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {/* Heart Toggle */}
                <button
                  onClick={() => handleToggleFavorite(photo.id, photo.isFavorite)}
                  className={`p-2 rounded-full shadow-md focus:outline-none transition-colors cursor-pointer ${
                    photo.isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/80 text-charcoal hover:bg-white hover:text-red-500'
                  }`}
                  title="Mark as Favorite"
                >
                  <Heart size={14} className={photo.isFavorite ? 'fill-current' : ''} />
                </button>

                {/* Direct Download option */}
                {gallery.allowDownload && (
                  <a
                    href={photo.url}
                    download={`suramya_gallery_${photo.id}.jpg`}
                    target="_blank"
                    className="p-2 bg-white/80 hover:bg-white text-charcoal hover:text-gold rounded-full shadow-md transition-colors"
                    title="Download high-resolution image"
                  >
                    <Download size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
