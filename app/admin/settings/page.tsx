import { prisma } from "@/lib/prisma";
import SettingsWorkspace from "@/components/SettingsWorkspace";
import { Metadata } from "next";

export const revalidate = 0; // Fresh loading

export const metadata: Metadata = {
  title: "Settings Manager | Suramya Dashboard",
};

export default async function AdminSettingsPage() {
  let settingsMap: Record<string, string> = {};

  try {
    const settings = await prisma.setting.findMany();
    settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to load settings in admin page:", error);
  }

  return <SettingsWorkspace initialSettings={settingsMap} />;
}
