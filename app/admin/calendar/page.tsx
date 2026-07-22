import { prisma } from "@/lib/prisma";
import CalendarWorkspace from "@/components/CalendarWorkspace";
import { Metadata } from "next";

export const revalidate = 0; // Fresh updates

export const metadata: Metadata = {
  title: "Studio Calendar | Suramya Dashboard",
};

export default async function AdminCalendarPage() {
  let events: any[] = [];

  try {
    events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("Failed to load calendar events:", error);
  }

  // Format dates strictly to YYYY-MM-DD for serialization safety on client components
  const serializedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date.toISOString().split("T")[0],
    type: e.type,
    notes: e.notes,
    color: e.color,
  }));

  return <CalendarWorkspace initialEvents={serializedEvents} />;
}
