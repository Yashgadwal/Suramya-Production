import { prisma } from "@/lib/prisma";
import BlogsCMS from "@/components/BlogsCMS";
import { Metadata } from "next";

export const revalidate = 0; // Fresh loading

export const metadata: Metadata = {
  title: "Blogs CMS | Suramya Dashboard",
};

export default async function AdminBlogsPage() {
  let blogs: any[] = [];

  try {
    blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load blog posts in CMS page:", error);
  }

  return <BlogsCMS initialBlogs={blogs} />;
}
