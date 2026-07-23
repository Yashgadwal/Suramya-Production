const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const filesToReplace = [
  'app/layout.tsx',
  'app/about/page.tsx',
  'app/page.tsx',
  'app/packages/page.tsx',
  'app/portfolio/page.tsx',
  'components/Footer.tsx',
  'prisma/seed.js',
];

function replaceInFiles() {
  console.log('Replacing "Ujjain" in static codebase files...');
  for (const relPath of filesToReplace) {
    const filePath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Case-insensitive replacements for specific phrases
    content = content.replace(/in Ujjain/g, 'all over India');
    content = content.replace(/in Ujjain/gi, 'all over India');
    content = content.replace(/Ujjain's/g, "India's");
    content = content.replace(/Ujjain's/gi, "India's");
    content = content.replace(/Across Ujjain/g, 'Across India');
    content = content.replace(/Across Ujjain/gi, 'Across India');
    content = content.replace(/around Ujjain/g, 'across India');
    content = content.replace(/around Ujjain/gi, 'across India');
    
    // Catch remaining standalone instances of "Ujjain" in copy, but avoid maps URLs
    content = content.replace(/Ujjain (?!Bus|Stand|Bus Stand|Bus-Stand|BusStand|maps|embed)/gi, 'all over India');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  }
}

async function replaceInDatabase() {
  console.log('Updating database records...');

  const replaceText = (text) => {
    if (!text) return text;
    let newText = text;
    newText = newText.replace(/in Ujjain/gi, 'all over India');
    newText = newText.replace(/Ujjain's/gi, "India's");
    newText = newText.replace(/Across Ujjain/gi, 'Across India');
    newText = newText.replace(/around Ujjain/gi, 'across India');
    newText = newText.replace(/Ujjain (?!Bus|Stand|Bus Stand|Bus-Stand|BusStand|maps|embed)/gi, 'all over India');
    return newText;
  };

  // 1. Settings
  const settings = await prisma.setting.findMany();
  for (const s of settings) {
    if (s.key === 'google_maps_embed') continue; // Don't break maps
    const newValue = replaceText(s.value);
    if (newValue !== s.value) {
      await prisma.setting.update({
        where: { id: s.id },
        data: { value: newValue }
      });
      console.log(`Updated Setting key "${s.key}"`);
    }
  }

  // 2. Services
  const services = await prisma.service.findMany();
  for (const s of services) {
    await prisma.service.update({
      where: { id: s.id },
      data: {
        name: replaceText(s.name),
        description: replaceText(s.description),
        seoTitle: replaceText(s.seoTitle),
        seoDescription: replaceText(s.seoDescription)
      }
    });
    console.log(`Updated Service "${s.name}"`);
  }

  // 3. Portfolio Projects
  const portfolio = await prisma.portfolioProject.findMany();
  for (const p of portfolio) {
    await prisma.portfolioProject.update({
      where: { id: p.id },
      data: {
        title: replaceText(p.title),
        description: replaceText(p.description),
        location: replaceText(p.location),
        seoTitle: replaceText(p.seoTitle),
        seoDescription: replaceText(p.seoDescription)
      }
    });
    console.log(`Updated Portfolio Project "${p.title}"`);
  }

  // 4. Testimonials
  const testimonials = await prisma.testimonial.findMany();
  for (const t of testimonials) {
    await prisma.testimonial.update({
      where: { id: t.id },
      data: {
        review: replaceText(t.review)
      }
    });
    console.log(`Updated Testimonial by "${t.name}"`);
  }

  // 5. Blog Posts
  const blogs = await prisma.blogPost.findMany();
  for (const b of blogs) {
    await prisma.blogPost.update({
      where: { id: b.id },
      data: {
        title: replaceText(b.title),
        content: replaceText(b.content),
        seoTitle: replaceText(b.seoTitle),
        seoDescription: replaceText(b.seoDescription)
      }
    });
    console.log(`Updated Blog Post "${b.title}"`);
  }

  // 6. Wedding Films
  const films = await prisma.weddingFilm.findMany();
  for (const f of films) {
    await prisma.weddingFilm.update({
      where: { id: f.id },
      data: {
        title: replaceText(f.title),
        description: replaceText(f.description)
      }
    });
    console.log(`Updated Wedding Film "${f.title}"`);
  }
}

async function main() {
  replaceInFiles();
  await replaceInDatabase();
  console.log('Replacement task completed successfully!');
}

main()
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
