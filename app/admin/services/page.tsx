import { prisma } from "@/lib/prisma";
import ServicesCMS from "@/components/ServicesCMS";
import { Metadata } from "next";

export const revalidate = 0; // Fresh content

export const metadata: Metadata = {
  title: "Services CMS | Suramya Dashboard",
};

export default async function AdminServicesPage() {
  let services: any[] = [];

  try {
    services = await prisma.service.findMany({
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to load services in CMS page:", error);
  }

  return <ServicesCMS initialServices={services} />;
}
