import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Wedding Blogs & Guides | Suramya Production Ujjain",
  description: "Read helpful planning tips, outfit guides, pre-wedding location reviews, and photography advice for your wedding day in Ujjain and Madhya Pradesh.",
};

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { draft: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load blog posts:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Studio Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            The Journal
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            Tips, guides, and visual inspiration curated by our team to help you plan your pre-wedding shoot and wedding day beautifully.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-beige/60 rounded-sm">
            <p className="font-serif text-sm text-grey-secondary tracking-widest">
              No journal articles published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between border border-beige/30 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="relative overflow-hidden aspect-video bg-beige/20 mb-5 rounded-sm">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-75 group-hover:scale-101"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 font-serif text-[10px] tracking-wider uppercase text-charcoal shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-4 items-center text-[10px] font-sans tracking-wider text-grey-secondary uppercase">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.readingTime} min read
                      </span>
                    </div>

                    <h3 className="font-serif text-sm sm:text-base tracking-wide text-charcoal group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs text-grey-secondary leading-relaxed line-clamp-3 font-light">
                      {post.content.replace(/<[^>]*>/g, "").slice(0, 140)}...
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-beige/30">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-serif text-xs tracking-wider uppercase text-gold hover:text-gold-dark transition-colors"
                  >
                    Read Article <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
