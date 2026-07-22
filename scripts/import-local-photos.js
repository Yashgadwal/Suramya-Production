const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sourceDir = 'Y:\\surmaya production';
const targetDir = 'Y:\\suramya-production\\public\\uploads';

async function run() {
  console.log('Starting image import from ' + sourceDir);

  // 1. Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 2. Read source directory
  const files = fs.readdirSync(sourceDir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const stats = fs.statSync(path.join(sourceDir, file));
    return stats.isFile() && imageExtensions.includes(ext);
  });

  console.log(`Found ${imageFiles.length} image files in source directory.`);

  // 3. Copy files to target directory
  const copiedPaths = [];
  for (const file of imageFiles) {
    const sourcePath = path.join(sourceDir, file);
    // Replace spaces and special characters with underscores for URL compatibility
    const safeName = file.replace(/[^a-zA-Z0-9.-]/g, '_');
    const targetPath = path.join(targetDir, safeName);
    
    fs.copyFileSync(sourcePath, targetPath);
    copiedPaths.push(`/uploads/${safeName}`);
  }

  console.log(`Copied ${copiedPaths.length} images to ${targetDir}`);

  if (copiedPaths.length === 0) {
    console.error('No images to import.');
    return;
  }

  // 4. Update Database records
  console.log('Updating database records with new local image paths...');

  // Helper to pick a random or sequential image
  let imageIdx = 0;
  const nextImage = () => {
    const img = copiedPaths[imageIdx % copiedPaths.length];
    imageIdx++;
    return img;
  };

  // Update Services
  const services = await prisma.service.findMany();
  for (const s of services) {
    const newImg = nextImage();
    await prisma.service.update({
      where: { id: s.id },
      data: { featuredImage: newImg }
    });
    console.log(`Updated Service "${s.name}" with image ${newImg}`);
  }

  // Update Testimonials (avatars)
  const testimonials = await prisma.testimonial.findMany();
  for (const t of testimonials) {
    const newImg = nextImage();
    await prisma.testimonial.update({
      where: { id: t.id },
      data: { avatar: newImg }
    });
    console.log(`Updated Testimonial for "${t.name}" with avatar ${newImg}`);
  }

  // Update Portfolio Projects
  const portfolio = await prisma.portfolioProject.findMany();
  for (const p of portfolio) {
    const cover = nextImage();
    // Generate an array of 4 local images for the project details photographs gallery
    const gallery = [nextImage(), nextImage(), nextImage(), nextImage()];
    await prisma.portfolioProject.update({
      where: { id: p.id },
      data: {
        coverImage: cover,
        photographs: JSON.stringify(gallery)
      }
    });
    console.log(`Updated Portfolio Project "${p.title}" with cover ${cover}`);
  }

  // Update Blog Posts (coverImages)
  const blogs = await prisma.blogPost.findMany();
  for (const b of blogs) {
    const newImg = nextImage();
    await prisma.blogPost.update({
      where: { id: b.id },
      data: { coverImage: newImg }
    });
    console.log(`Updated Blog Post "${b.title}" with image ${newImg}`);
  }

  console.log('Database records updated successfully!');
}

run()
  .catch(err => {
    console.error('Error during import:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
