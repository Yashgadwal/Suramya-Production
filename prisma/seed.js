const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper to get local uploaded images
const getLocalImages = () => {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    return files.filter(f => f.match(/\.(jpg|jpeg|png|gif|webp)$/i)).map(f => `/uploads/${f}`);
  }
  return [];
};

async function main() {
  console.log('Clearing database tables for fresh seeding...');
  await prisma.portfolioProject.deleteMany();
  await prisma.weddingFilm.deleteMany();
  await prisma.package.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.service.deleteMany();
  await prisma.blogPost.deleteMany();
  console.log('Database tables cleared.');

  // Set up local image lookup
  const localImages = getLocalImages();
  let imgIdx = 0;
  const getImg = (fallback) => {
    if (localImages.length > 0) {
      const img = localImages[imgIdx % localImages.length];
      imgIdx++;
      return img;
    }
    return fallback;
  };

  // Helper to generate a gallery array
  const getGallery = (count, fallbackArray) => {
    if (localImages.length > 0) {
      const gallery = [];
      for (let i = 0; i < count; i++) {
        gallery.push(localImages[(imgIdx + i) % localImages.length]);
      }
      imgIdx += count;
      return JSON.stringify(gallery);
    }
    return JSON.stringify(fallbackArray);
  };

  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash('Suramya@2026', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminPassword, email: 'admin@suramyaproduction.com' },
    create: {
      username: 'admin',
      email: 'admin@suramyaproduction.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Seeded admin user.');

  // 2. Seed Global Settings
  const settings = [
    { key: 'business_name', value: 'Suramya Production' },
    { key: 'tagline', value: 'Capture Your Love, Cherish Forever!' },
    { key: 'phone', value: '+917999615949' },
    { key: 'whatsapp', value: '+917999615949' },
    { key: 'address', value: 'Nanakheda, Ujjain, Madhya Pradesh' },
    { key: 'timings', value: '10:00 AM - 09:00 PM (Everyday)' },
    { key: 'instagram', value: 'https://www.instagram.com/suramya_production/' },
    { key: 'facebook', value: 'https://www.facebook.com/saumitraphotography/' },
    { key: 'justdial', value: 'https://www.justdial.com/Ujjain/Suramya-Production-Front-Nanakheda-Bus-Stand-Nanakheda/9999PX734-X734-240516164948-C1W6_BZDET' },
    { key: 'google_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.3079978716383!2d75.7865239!3d23.1498188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963750058b73a3b%3A0xc3c5c9945df8ee01!2sSuramya%20Production!5e0!3m2!1sen!2sin!4v1721580000000!5m2!1sen!2sin' },
    { key: 'announcement_enabled', value: 'false' },
    { key: 'announcement_text', value: '🎉 Booking Open for the Upcoming Wedding & Festive Season 2026! Reserve your date now.' },
    { key: 'announcement_link', value: '/book' },
    { key: 'service_areas', value: 'Freeganj, Nanakheda, Mahakal Lok, Ujjain Outer, Indore, Bhopal, Dewas' },
    { key: 'growth_partner_credit', value: 'true' }
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('Seeded settings.');

  // 3. Seed Services
  const services = [
    {
      name: 'Wedding Photography',
      slug: 'wedding-photography',
      featuredImage: getImg('https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop'),
      description: 'Candid and contemporary photography that documents your love story, capturing both the grandeur of the ceremonies and the intimacy of stolen glances.',
      inclusions: JSON.stringify([
        'Lead Candid Photographer',
        'Traditional Photographer',
        'High-Res Edited Digital Gallery',
        'Custom Premium Wedding Album (100 pages)'
      ]),
      customerType: 'Couples looking for a mix of emotional candid shots and timeless traditional family portraits.',
      displayOrder: 1,
      enabled: true,
      seoTitle: 'Wedding Photographer in Ujjain | Suramya Production',
      seoDescription: 'Premium wedding photography services in Ujjain by Suramya Production. Capturing candid emotions and timeless wedding stories.'
    },
    {
      name: 'Wedding Cinematography',
      slug: 'wedding-cinematography',
      featuredImage: getImg('https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop'),
      description: 'Cinematic storytelling that brings your wedding day to life. From drone shots to emotional sound bites, we create a movie you\'ll watch forever.',
      inclusions: JSON.stringify([
        'Cinematic Director',
        'Drone/Aerial Cinematography',
        '3-5 Minute Highlight Film',
        'Full Length Documentary Video'
      ]),
      customerType: 'Couples who want a cinematic, movie-like record of their wedding rituals and emotional celebrations.',
      displayOrder: 2,
      enabled: true,
      seoTitle: 'Wedding Cinematography in Ujjain | Suramya Production',
      seoDescription: 'Cinematic wedding films and high-end videography in Ujjain. Relive your special day with our emotional films.'
    },
    {
      name: 'Pre-Wedding Shoots',
      slug: 'pre-wedding-shoot',
      featuredImage: getImg('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'),
      description: 'Fun, romantic, and stylized photo & video sessions in gorgeous locations around Ujjain or travel destinations, celebrating your journey before the wedding.',
      inclusions: JSON.stringify([
        'One-day outdoor shoot (2-3 locations)',
        'Romantic teaser video (1 min)',
        '30 fully edited high-res images',
        'Outfit consultation and creative direction'
      ]),
      customerType: 'Engaged couples wanting to capture their chemistry and create beautiful announcements or save-the-date media.',
      displayOrder: 3,
      enabled: true,
      seoTitle: 'Pre-Wedding Photographer Ujjain | Suramya Production',
      seoDescription: 'Beautiful pre-wedding photo and video shoots in Ujjain. Creative concepts, stunning locations, and romantic storytelling.'
    },
    {
      name: 'Baby and Maternity Shoots',
      slug: 'baby-maternity-shoot',
      featuredImage: getImg('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200&auto=format&fit=crop'),
      description: 'Delicate, cozy, and high-quality photography celebrating the beauty of new motherhood and the innocence of your newborn\'s first days.',
      inclusions: JSON.stringify([
        'Studio set up or home session',
        'Baby props & themes included',
        'Posed and lifestyle family images',
        'Digital gallery with 20 edited files'
      ]),
      customerType: 'New and expecting parents seeking to preserve the magical milestone of pregnancy and childhood.',
      displayOrder: 4,
      enabled: true,
      seoTitle: 'Baby Photographer in Ujjain | Suramya Production',
      seoDescription: 'Professional baby photography, newborn, and maternity shoots in Ujjain. Safe and warm studio settings.'
    }
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: svc,
      create: svc,
    });
  }
  console.log('Seeded services.');

  // 4. Seed Packages
  const packages = [
    {
      name: 'Essential Photography',
      price: 45000,
      priceType: 'Starting From',
      description: 'Perfect for intimate weddings, focused on delivering high-quality candid and traditional photography for a single-day event.',
      hoursCovered: 12,
      photographersCount: 2,
      videographersCount: 0,
      deliverables: JSON.stringify([
        '1 Candid Photographer',
        '1 Traditional Photographer',
        '150+ Edited High-Resolution Photos',
        'Online Digital Gallery (Private & Password Secured)',
        '1 Premium Hardbound Photobook (80 Pages)'
      ]),
      albumsCount: 1,
      droneEnabled: false,
      reelsEnabled: false,
      highlightFilmEnabled: false,
      deliveryWeeks: 4,
      badge: 'Intimate Weddings',
      featured: false,
      order: 1,
      visible: true
    },
    {
      name: 'Signature Wedding Story',
      price: 95000,
      priceType: 'Starting From',
      description: 'Our most popular comprehensive photography and cinematography package, capturing all elements of your multi-day Indian wedding.',
      hoursCovered: 24,
      photographersCount: 2,
      videographersCount: 2,
      deliverables: JSON.stringify([
        '1 Candid Photographer & 1 Traditional Photographer',
        '1 Cinematic Videographer & 1 Traditional Videographer',
        '300+ Fully Refined High-Res Digital Images',
        '3-5 min Cinematic Highlight Film',
        'Full Length documentary style movie (45-60 mins)',
        '2 Premium Coffee Table Albums (100 pages each)',
        'Drone / Aerial Coverage (Weather permitting)',
        '2 Instagram Reels / Teasers'
      ]),
      albumsCount: 2,
      droneEnabled: true,
      reelsEnabled: true,
      highlightFilmEnabled: true,
      deliveryWeeks: 6,
      badge: 'Most Popular',
      featured: true,
      order: 2,
      visible: true
    },
    {
      name: 'Photography & Cinematography Luxury',
      price: 150000,
      priceType: 'Starting From',
      description: 'The ultimate luxury visual preservation. Complete multi-day wedding coverage featuring our top creative directors, high-end production, and premium output.',
      hoursCovered: 36,
      photographersCount: 3,
      videographersCount: 3,
      deliverables: JSON.stringify([
        '2 Candid Photographers & 1 Traditional Photographer',
        '2 Cinematic Directors & 1 Traditional Videographer',
        '500+ Luxury Grade Edited Images',
        '10-12 min Cinematic Documentary Film',
        '3-4 Reels / Short Films for Social Media',
        '1 Signature Pre-wedding shoot included (worth 30K)',
        '3 Premium Italian Leather Albums',
        'Next-Day Reel Delivery'
      ]),
      albumsCount: 3,
      droneEnabled: true,
      reelsEnabled: true,
      highlightFilmEnabled: true,
      deliveryWeeks: 8,
      badge: 'Luxury Production',
      featured: false,
      order: 3,
      visible: true
    }
  ];

  for (const pkg of packages) {
    await prisma.package.create({
      data: pkg
    });
  }
  console.log('Seeded packages.');

  // 5. Seed Testimonials
  const testimonials = [
    {
      name: 'Rahul & Shruti Shrivastava',
      type: 'Wedding Shoot',
      avatar: getImg('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'),
      review: 'Suramya Production captured our wedding at Mahakal Lok area beautifully. The team was extremely polite and didn\'t force us into uncomfortable poses. The final cinematic wedding film was like a bollywood movie. Recommended to everyone in Ujjain!',
      rating: 5,
      sourceUrl: 'https://www.justdial.com/',
      approved: true,
      featured: true
    },
    {
      name: 'Amit & Priya Sharma',
      type: 'Pre-Wedding Shoot',
      avatar: getImg('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'),
      review: 'Our pre-wedding shoot in Nanakheda and shipra river ghats was amazing. The photographer guided us on every pose and expression. We got our photos on time, and they are stunning.',
      rating: 5,
      sourceUrl: 'https://www.google.com/',
      approved: true,
      featured: true
    }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t
    });
  }
  console.log('Seeded testimonials.');

  // 6. Seed Portfolio Projects
  const portfolio = [
    {
      title: 'Devashish & Riya\'s Royal Ujjain Wedding',
      slug: 'devashish-riya-royal-wedding',
      coverImage: getImg('https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop'),
      clientName: 'Devashish & Riya',
      category: 'Wedding',
      location: 'Nanakheda, Ujjain',
      date: new Date('2026-05-15'),
      description: 'An elegant, rich Indian wedding celebrating culture, rituals, and intense love. The couple wanted candid storytelling focusing on tears, laughter, and gold details.',
      photographs: getGallery(4, [
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'
      ]),
      videos: JSON.stringify([]),
      featured: true,
      draft: false,
      seoTitle: 'Devashish and Riya Wedding | Suramya Production',
      seoDescription: 'Browse the royal Indian wedding photos of Devashish and Riya in Ujjain captured by Suramya Production.'
    },
    {
      title: 'Romance by the Shipra: Saurabh & Aditi',
      slug: 'saurabh-aditi-prewedding',
      coverImage: getImg('https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'),
      clientName: 'Saurabh & Aditi',
      category: 'Pre-Wedding',
      location: 'Ram Ghat, Ujjain',
      date: new Date('2026-04-10'),
      description: 'A serene and dreamlike pre-wedding shoot at sunrise by the ghats of Ujjain, featuring traditional attire, smoke bombs, and modern casual portraits.',
      photographs: getGallery(3, [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-151097252790b-af4f42d91499?q=80&w=1200&auto=format&fit=crop'
      ]),
      videos: JSON.stringify([]),
      featured: true,
      draft: false,
      seoTitle: 'Saurabh and Aditi Pre-wedding | Suramya Production',
      seoDescription: 'Beautiful pre-wedding shoot gallery of Saurabh and Aditi by Shipra River ghats, Ujjain.'
    },
    {
      title: 'Kabir & Ananya\'s Vibrant Haldi Story',
      slug: 'kabir-ananya-haldi-story',
      coverImage: getImg('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop'),
      clientName: 'Kabir & Ananya',
      category: 'Haldi',
      location: 'Freeganj, Ujjain',
      date: new Date('2026-06-02'),
      description: 'A colorful, marigold-drenched celebration featuring yellow theme settings, water splashes, and intense family joy in Ujjain.',
      photographs: getGallery(2, [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'
      ]),
      videos: JSON.stringify([]),
      featured: true,
      draft: false,
      seoTitle: 'Kabir and Ananya Haldi Celebration | Suramya Production',
      seoDescription: 'Witness the vibrant Haldi celebrations of Kabir and Ananya in Freeganj, Ujjain.'
    }
  ];

  for (const project of portfolio) {
    await prisma.portfolioProject.create({
      data: project
    });
  }
  console.log('Seeded portfolio.');

  // 7. Seed FAQs
  const faqs = [
    {
      id: 'faq-1',
      key: 'booking_time',
      value: JSON.stringify({
        question: 'How early should we book our wedding photographer?',
        answer: 'We recommend booking 4 to 6 months in advance, especially for wedding seasons (November to February and April to July). Since we accept limited bookings to maintain our premium quality, dates fill up quickly.'
      })
    },
    {
      id: 'faq-2',
      key: 'both_services',
      value: JSON.stringify({
        question: 'Do you offer both photography and cinematography?',
        answer: 'Yes! We offer fully integrated teams featuring candid photographers, traditional photographers, cinematic directors, drone pilots, and editors. Booking our combined team ensures a synchronized creative direction and zero friction on the day of the shoot.'
      })
    },
    {
      id: 'faq-3',
      key: 'travel',
      value: JSON.stringify({
        question: 'Are you available to travel outside Ujjain?',
        answer: 'Absolutely! While we are based in Ujjain, we travel across Madhya Pradesh (Indore, Bhopal, Gwalior) and India for destination weddings. Travel and accommodation charges are typically handled by the client.'
      })
    },
    {
      id: 'faq-4',
      key: 'deliverables_time',
      value: JSON.stringify({
        question: 'What is the delivery timeline for photos and films?',
        answer: 'We deliver sneak peeks within 3-5 days. The fully processed high-resolution digital image gallery is delivered within 4-6 weeks, and custom wedding albums/highlight films are delivered within 8-10 weeks of the ceremony.'
      })
    }
  ];

  for (const f of faqs) {
    await prisma.setting.upsert({
      where: { key: f.key },
      update: { value: f.value },
      create: { key: f.key, value: f.value },
    });
  }
  console.log('Seeded FAQs.');

  // 8. Seed Blog Posts
  const blogs = [
    {
      title: 'Planning Your Pre-Wedding Shoot in Ujjain: Best Locations & Outfits',
      slug: 'planning-pre-wedding-shoot-ujjain-locations-outfits',
      content: 'Ujjain offers a gorgeous mix of spiritual ghats, historic architecture, and modern scenic parks. In this guide, we break down our top shoot locations—such as Ram Ghat, Mahakal Lok Corridor, and Indore Road resorts—along with styling tips for the perfect romantic pre-wedding frames.',
      coverImage: getImg('https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop'),
      category: 'Pre-Wedding Tips',
      tags: 'Pre-Wedding, Ujjain, Outfits, Locations',
      author: 'Saumitra Suramya',
      draft: false,
      seoTitle: 'Pre-Wedding Shoot Guide Ujjain | Suramya Production',
      seoDescription: 'Learn about the best locations, timings, and outfits for a romantic pre-wedding photo shoot in Ujjain.',
      readingTime: 4
    }
  ];

  for (const b of blogs) {
    await prisma.blogPost.create({
      data: b
    });
  }
  console.log('Seeded blogs.');

  // 9. Seed Wedding Films & Reels (3 Horizontal films & 4 vertical reels)
  const films = [
    {
      title: 'A Tale of Love: Ritesh & Divya',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop'),
      isVertical: false,
      description: 'Highlight wedding film of Ritesh and Divya showcasing their vibrant haldi in Nanakheda and reception in Indore.',
      featured: true,
      order: 1
    },
    {
      title: 'Royalty in Ujjain: Devashish & Riya',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop'),
      isVertical: false,
      description: 'Cinematic royal wedding highlighting core Indian rituals at Mahakal Corridor, Ujjain.',
      featured: true,
      order: 2
    },
    {
      title: 'Sunrise Romance: Saurabh & Aditi',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'),
      isVertical: false,
      description: 'A beautiful morning sunrise prewedding teaser on the Shipra River Ram Ghat.',
      featured: true,
      order: 3
    },
    {
      title: 'Haldi Joy: Kabir & Ananya',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop'),
      isVertical: true,
      description: 'Instagram reel showing marigold color splashes and joy in Freeganj, Ujjain.',
      featured: true,
      order: 4
    },
    {
      title: 'Bride\'s Entry Highlight Teaser',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'),
      isVertical: true,
      description: 'Slow motion reel of Riya entering the mandap under phoolon ki chadar.',
      featured: true,
      order: 5
    },
    {
      title: 'Traditional Ring Ceremony',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop'),
      isVertical: true,
      description: 'Romantic ring swap closeups and emotional couple glances.',
      featured: true,
      order: 6
    },
    {
      title: 'Pre-wedding Sunrise Magic',
      url: 'https://www.youtube.com/embed/ysz5S6PUM-U',
      thumbnail: getImg('https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop'),
      isVertical: true,
      description: 'Short pre-wedding cinematic teaser reel.',
      featured: true,
      order: 7
    }
  ];

  for (const f of films) {
    await prisma.weddingFilm.create({
      data: f
    });
  }
  console.log('Seeded films and vertical reels.');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
