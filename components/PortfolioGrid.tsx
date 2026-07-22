'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  clientName: string;
  category: string;
  location: string;
  date: string | Date;
  description: string;
}

interface PortfolioGridProps {
  projects: Project[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Wedding',
    'Pre-Wedding',
    'Haldi',
    'Mehendi',
    'Bridal',
    'Baby',
    'Fashion',
    'Events',
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-12">
      {/* Categories Filter Strip */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-b border-beige/40 pb-6 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 font-sans border focus:outline-none cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gold border-gold text-ivory font-medium'
                : 'border-beige hover:border-gold hover:text-gold text-charcoal'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-beige/60 rounded-sm">
          <p className="font-serif text-sm text-grey-secondary tracking-widest">
            No stories captured in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col justify-between border border-beige/30 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-beige/20 mb-5">
                <ImageWithSkeleton
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 font-serif text-[10px] tracking-wider uppercase text-charcoal shadow-sm">
                  {project.category}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-sans tracking-wider text-grey-secondary uppercase">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(project.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="font-serif text-sm sm:text-base tracking-wide text-charcoal group-hover:text-gold transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-xs text-grey-secondary line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="inline-block pt-3 font-serif text-xs tracking-wider uppercase text-gold border-t border-beige/30 w-full mt-2">
                  View full story →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
