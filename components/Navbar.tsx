'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  businessName: string;
}

export default function Navbar({ businessName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/services' },
    { name: 'Wedding Films', href: '/films' },
    { name: 'Packages', href: '/packages' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isHomepage = pathname === '/';
  
  // Style configurations based on scroll state & current route
  const headerBgClass = isScrolled || !isHomepage
    ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige/40 py-3.5'
    : 'bg-transparent py-6';

  const logoColorClass = isScrolled || !isHomepage
    ? 'text-charcoal'
    : 'text-ivory';

  const linkColorClass = (href: string) => {
    const isActive = pathname === href;
    if (isScrolled || !isHomepage) {
      return isActive ? 'text-gold font-medium' : 'text-charcoal hover:text-gold';
    } else {
      return isActive ? 'text-gold font-medium' : 'text-ivory/90 hover:text-gold';
    }
  };

  const ctaBtnClass = isScrolled || !isHomepage
    ? 'bg-gold hover:bg-gold-dark text-ivory'
    : 'bg-ivory hover:bg-gold text-charcoal hover:text-ivory';

  const menuBtnColor = isScrolled || !isHomepage ? 'text-charcoal' : 'text-ivory';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ${headerBgClass}`}
        suppressHydrationWarning={true}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" suppressHydrationWarning={true}>
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group flex flex-col focus:outline-none leading-none max-w-[200px] sm:max-w-none"
          >
            <span className={`font-hindi text-lg sm:text-xl md:text-2xl tracking-[0.05em] whitespace-nowrap transition-colors duration-300 group-hover:text-gold ${logoColorClass}`}>
              सुरम्या प्रोडक्शन
            </span>
            <span className="text-[8px] tracking-[0.25em] sm:tracking-[0.32em] uppercase text-grey-secondary mt-1 pl-0.5">
              STUDIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (pathname === link.href) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`relative font-sans text-[11px] tracking-[0.18em] uppercase py-2 transition-colors duration-300 ${linkColorClass(
                    link.href
                  )}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden lg:block" suppressHydrationWarning={true}>
            <Link
              href="/book"
              className={`inline-block px-6 py-2.5 font-serif text-[10px] tracking-widest uppercase transition-all duration-300 rounded-none shadow-sm transform hover:scale-[1.02] hover:tracking-[0.2em] ${ctaBtnClass}`}
            >
              Book Your Date
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 transition-colors focus:outline-none cursor-pointer ${menuBtnColor}`}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-ivory transition-transform duration-500 lg:hidden flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        suppressHydrationWarning={true}
      >
        <div className="flex flex-col h-full" suppressHydrationWarning={true}>
          {/* Mobile Header Inside Drawer */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-beige/40" suppressHydrationWarning={true}>
            <Link
              href="/"
              onClick={(e) => {
                setIsOpen(false);
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex flex-col"
            >
              <span className="font-hindi text-xl tracking-wide text-charcoal">
                सुरम्या प्रोडक्शन
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-grey-secondary -mt-1 pl-0.5">
                STUDIO
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-charcoal hover:text-gold focus:outline-none cursor-pointer"
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Links */}
          <nav className="flex flex-col items-center justify-center flex-grow space-y-6 py-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (pathname === link.href) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`font-serif text-lg tracking-widest uppercase transition-colors duration-300 hover:text-gold ${
                    isActive ? 'text-gold' : 'text-charcoal'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="mt-4 px-8 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase transition-all duration-300 hover:tracking-[0.25em]"
            >
              Book Your Date
            </Link>
          </nav>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-beige/40 text-center" suppressHydrationWarning={true}>
            <p className="text-[10px] tracking-widest text-grey-secondary uppercase">
              Ujjain, Madhya Pradesh
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
