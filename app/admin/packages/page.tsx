import { prisma } from "@/lib/prisma";
import PackagesCMS from "@/components/PackagesCMS";
import { Metadata } from "next";

export const revalidate = 0; // Fresh loading

export const metadata: Metadata = {
  title: "Packages CMS | Suramya Dashboard",
};

export default async function AdminPackagesPage() {
  let packages: any[] = [];

  try {
    packages = await prisma.package.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to load packages in CMS page:", error);
  }

  return <PackagesCMS initialPackages={packages} />;
}
