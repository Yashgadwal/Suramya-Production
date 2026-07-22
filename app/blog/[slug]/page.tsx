import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seoTitle || `${post.title} | Suramya Production Blog`,
    description: post.seoDescription || post.content.replace(/<[^>]*>/g, "").slice(0, 155),
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.draft) {
    notFound();
  }

  // Structured Data Schema for Blog Posting
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage,
    "datePublished": post.createdAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Suramya Production",
      "logo": {
        "@type": "ImageObject",
        "url": "https://suramyaproduction.com/favicon.ico"
      }
    },
    "description": post.seoDescription || post.content.replace(/<[^>]*>/g, "").slice(0, 150)
  };

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* JSON-LD schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-grey-secondary hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Journal
        </Link>

        {/* Article Meta */}
        <div className="space-y-4 text-center">
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold block">
            {post.category}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-charcoal leading-tight max-w-3xl mx-auto">
            {post.title}
          </h1>
          <div className="flex justify-center items-center gap-6 text-[10px] sm:text-xs font-sans tracking-widest uppercase text-grey-secondary pt-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full bg-beige overflow-hidden border border-beige/40 rounded-sm shadow-sm">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-stone max-w-none font-sans text-charcoal-light text-sm sm:text-base leading-relaxed space-y-6 font-light">
          {/* Simple content splits by paragraphs to style nicely */}
          {post.content.split("\n\n").map((para, idx) => (
            <p key={idx} className="first-letter:font-serif first-letter:text-charcoal">
              {para}
            </p>
          ))}
        </article>

        {/* Author signoff */}
        <div className="border-t border-beige/40 pt-10 mt-16 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] tracking-widest uppercase text-grey-secondary font-sans">Published By</p>
            <p className="font-serif text-sm text-charcoal">{post.author}</p>
          </div>
          <div>
            <Link
              href="/book"
              className="inline-block px-6 py-3 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-wider uppercase transition-colors rounded-sm"
            >
              Discuss Your Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
