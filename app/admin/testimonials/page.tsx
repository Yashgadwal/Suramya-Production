import { prisma } from "@/lib/prisma";
import TestimonialsCMS from "@/components/TestimonialsCMS";
import { Metadata } from "next";

export const revalidate = 0; // Fresh loading

export const metadata: Metadata = {
  title: "Testimonials CMS | Suramya Dashboard",
};

export default async function AdminTestimonialsPage() {
  let testimonials: any[] = [];

  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load testimonials in CMS page:", error);
  }

  return <TestimonialsCMS initialTestimonials={testimonials} />;
}
