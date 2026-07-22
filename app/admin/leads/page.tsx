import { prisma } from "@/lib/prisma";
import CRMContainer from "@/components/CRMContainer";
import { Metadata } from "next";

export const revalidate = 0; // Fresh content

export const metadata: Metadata = {
  title: "CRM Leads Manager | Suramya Dashboard",
};

export default async function AdminLeadsPage() {
  let leads: any[] = [];

  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        notes: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load CRM leads:", error);
  }

  // Map database dates to ISO strings for client component serialization
  const serializedLeads = leads.map((lead) => ({
    ...lead,
    eventDate: lead.eventDate.toISOString().split("T")[0],
    altDate: lead.altDate ? lead.altDate.toISOString().split("T")[0] : null,
    createdAt: lead.createdAt.toISOString(),
    notes: lead.notes.map((note: any) => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    })),
  }));

  return <CRMContainer initialLeads={serializedLeads} />;
}
