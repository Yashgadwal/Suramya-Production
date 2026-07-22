import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  CalendarCheck2,
  BadgeAlert,
  Wallet,
  Sparkles,
  TrendingUp,
  ExternalLink,
  Plus
} from "lucide-react";

export const revalidate = 0; // Disable caching

export default async function AdminDashboardOverview() {
  let totalCount = 0;
  let newCount = 0;
  let bookedCount = 0;
  let totalQuoted = 0;
  let totalCollected = 0;
  let recentLeads: any[] = [];
  let upcomingBookings: any[] = [];
  let sourceCounts: Record<string, number> = {};

  try {
    // Queries
    totalCount = await prisma.lead.count();
    newCount = await prisma.lead.count({ where: { status: "New" } });
    bookedCount = await prisma.lead.count({ where: { status: "Booked" } });

    // Financial aggregation
    const leadsWithFinance = await prisma.lead.findMany({
      where: {
        OR: [
          { quotedAmount: { not: null } },
          { advancePaid: { not: null } },
        ]
      }
    });

    leadsWithFinance.forEach((lead) => {
      if (lead.quotedAmount) totalQuoted += lead.quotedAmount;
      if (lead.advancePaid) totalCollected += lead.advancePaid;
    });

    // Recent leads
    recentLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Upcoming bookings
    upcomingBookings = await prisma.lead.findMany({
      where: {
        status: "Booked",
        eventDate: { gte: new Date() },
      },
      orderBy: { eventDate: "asc" },
      take: 4,
    });

    // Source breakdown
    const allLeads = await prisma.lead.findMany({ select: { source: true } });
    allLeads.forEach((lead) => {
      const src = lead.source || "Website Form";
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
  } catch (error) {
    console.error("Dashboard overview stats error:", error);
  }

  const outstandingDue = totalQuoted - totalCollected;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal tracking-wide">Studio Dashboard</h1>
          <p className="text-xs text-grey-secondary font-light">
            Welcome back. Here is the active pipeline summary for Suramya Production.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={12} /> Manage Leads
          </Link>
          <Link
            href="/admin/calendar"
            className="px-4 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal bg-white font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5"
          >
            View Calendar
          </Link>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        {/* Total Enquiries */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-grey-secondary tracking-wider font-semibold">Total Inquiries</span>
            <p className="text-2xl font-serif text-charcoal">{totalCount}</p>
            <span className="text-[9px] text-green-600 font-medium">Accumulated leads</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-sm">
            <Users size={20} />
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-grey-secondary tracking-wider font-semibold">New Messages</span>
            <p className="text-2xl font-serif text-charcoal">{newCount}</p>
            <span className="text-[9px] text-amber-600 font-medium">Needs quick response</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
            <BadgeAlert size={20} />
          </div>
        </div>

        {/* Booked Shoots */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-grey-secondary tracking-wider font-semibold">Booked Shoots</span>
            <p className="text-2xl font-serif text-charcoal">{bookedCount}</p>
            <span className="text-[9px] text-emerald-600 font-medium">Locked in calendar</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-sm">
            <CalendarCheck2 size={20} />
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-grey-secondary tracking-wider font-semibold">Finance Collected</span>
            <p className="text-xl font-serif text-gold">₹{totalCollected.toLocaleString("en-IN")}</p>
            <span className="text-[9px] text-grey-secondary font-medium">Outstanding: ₹{outstandingDue.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-3 bg-gold/10 text-gold rounded-sm">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="font-serif text-sm tracking-wide text-charcoal">Recent Inquiries</h3>
            <Link href="/admin/leads" className="text-[10px] tracking-wider uppercase text-gold hover:underline flex items-center gap-1">
              View All CRM <ExternalLink size={10} />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No inquiries logged yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="py-3.5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-charcoal">{lead.name}</p>
                    <p className="text-[10px] text-grey-secondary">
                      {lead.shootType} • {lead.city} • ID: <span className="font-bold underline">{lead.enquiryId}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-grey-secondary">
                      {new Date(lead.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[8px] uppercase tracking-wide ${
                      lead.status === 'New' ? 'bg-amber-100 text-amber-800' :
                      lead.status === 'Booked' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar panels (Source + Bookings) */}
        <div className="space-y-8">
          {/* Upcoming Shoots */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6 shadow-sm">
            <h3 className="font-serif text-sm tracking-wide text-charcoal pb-4 border-b border-gray-100 flex items-center gap-1.5">
              <CalendarCheck2 size={16} className="text-gold" /> Upcoming Shoots
            </h3>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-6 text-gray-400">No upcoming booked shoots.</div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((bk) => (
                  <div key={bk.id} className="border-l-2 border-gold pl-3 py-1 space-y-1 text-xs">
                    <p className="font-medium text-charcoal">{bk.name}</p>
                    <p className="text-[10px] text-grey-secondary">
                      {bk.shootType} • {bk.venue || bk.city}
                    </p>
                    <p className="text-[9px] text-gold font-medium">
                      Date: {new Date(bk.eventDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Traffic Source strip */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6 shadow-sm">
            <h3 className="font-serif text-sm tracking-wide text-charcoal pb-4 border-b border-gray-100 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-gold" /> Referral Source Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([source, count]) => {
                const percentage = Math.round((count / totalCount) * 100) || 0;
                return (
                  <div key={source} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-charcoal">{source}</span>
                      <span className="text-grey-secondary">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-gold h-1 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
