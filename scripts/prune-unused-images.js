const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, '../public/uploads');

async function run() {
  console.log('Starting image pruning...');

  // 1. Gather all hardcoded images used in static files
  const usedImages = new Set([
    '/uploads/01.jpg',
    '/uploads/10.jpg',
    '/uploads/12.jpg',
    '/uploads/13.jpg',
  ]);

  // 2. Query all database tables for image references
  
  // Services
  const services = await prisma.service.findMany({ select: { featuredImage: true } });
  for (const s of services) {
    if (s.featuredImage) usedImages.add(s.featuredImage);
  }

  // Testimonials
  const testimonials = await prisma.testimonial.findMany({ select: { avatar: true } });
  for (const t of testimonials) {
    if (t.avatar) usedImages.add(t.avatar);
  }

  // Blog Posts
  const blogs = await prisma.blogPost.findMany({ select: { coverImage: true } });
  for (const b of blogs) {
    if (b.coverImage) usedImages.add(b.coverImage);
  }

  // Wedding Films
  const films = await prisma.weddingFilm.findMany({ select: { thumbnail: true } });
  for (const f of films) {
    if (f.thumbnail) usedImages.add(f.thumbnail);
  }

  // Portfolio Projects
  const portfolio = await prisma.portfolioProject.findMany({ 
    select: { coverImage: true, photographs: true } 
  });
  for (const p of portfolio) {
    if (p.coverImage) usedImages.add(p.coverImage);
    if (p.photographs) {
      try {
        const photos = JSON.parse(p.photographs);
        if (Array.isArray(photos)) {
          photos.forEach(img => usedImages.add(img));
        }
      } catch (e) {
        console.error('Error parsing photographs for project:', p.title);
      }
    }
  }

  console.log('Used images compile complete. Total unique used images:', usedImages.size);
  console.log('Used images list:', Array.from(usedImages));

  // Convert URLs (e.g. "/uploads/file.jpg") to local filenames (e.g. "file.jpg")
  const usedFilenames = new Set();
  usedImages.forEach(imgUrl => {
    if (imgUrl.startsWith('/uploads/')) {
      const filename = imgUrl.substring('/uploads/'.length);
      usedFilenames.add(filename.toLowerCase());
    }
  });

  // 3. Scan the public/uploads directory and delete any files not in our used set
  if (!fs.existsSync(uploadsDir)) {
    console.error('Uploads directory does not exist!');
    return;
  }

  const filesInUploads = fs.readdirSync(uploadsDir);
  let pruneCount = 0;
  let keepCount = 0;

  for (const file of filesInUploads) {
    const stats = fs.statSync(path.join(uploadsDir, file));
    if (stats.isFile()) {
      if (usedFilenames.has(file.toLowerCase())) {
        keepCount++;
      } else {
        console.log(`Pruning unused image: ${file}`);
        fs.unlinkSync(path.join(uploadsDir, file));
        pruneCount++;
      }
    }
  }

  console.log(`Pruning complete! Deleted ${pruneCount} unused images. Kept ${keepCount} active images.`);
}

run()
  .catch(err => {
    console.error('Error during pruning:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
