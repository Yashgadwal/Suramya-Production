import { getSession } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  Image as ImageIcon,
  FolderHeart,
  Wrench,
  Tag,
  MessageSquareQuote,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
  UserCheck
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If not logged in, render the login page directly (no sidebar wrappers)
  if (!session) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Lead CRM", href: "/admin/leads", icon: <Users2 size={18} /> },
    { name: "Calendar", href: "/admin/calendar", icon: <CalendarDays size={18} /> },
    { name: "Media Library", href: "/admin/media", icon: <ImageIcon size={18} /> },
    { name: "Portfolio", href: "/admin/portfolio", icon: <FolderHeart size={18} /> },
    { name: "Services", href: "/admin/services", icon: <Wrench size={18} /> },
    { name: "Packages", href: "/admin/packages", icon: <Tag size={18} /> },
    { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquareQuote size={18} /> },
    { name: "Blogs", href: "/admin/blogs", icon: <BookOpen size={18} /> },
    { name: "Settings", href: "/admin/settings", icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-xs">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 flex flex-col">
          <span className="font-serif text-lg tracking-wider text-charcoal">SURAMYA ADMIN</span>
          <span className="text-[9px] tracking-widest text-gold uppercase mt-0.5">Control Center</span>
        </div>

        {/* User Badge */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div className="p-2 bg-gold/10 text-gold rounded-full">
            <UserCheck size={16} />
          </div>
          <div>
            <p className="font-semibold text-charcoal">{session.username}</p>
            <p className="text-[10px] text-grey-secondary">{session.role}</p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-grey-secondary hover:text-gold hover:bg-gold/5 rounded-sm transition-all"
            >
              {item.icon}
              <span className="font-medium tracking-wide uppercase text-[10px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-grow flex flex-col">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <span className="font-serif text-base tracking-wider text-charcoal">SURAMYA ADMIN</span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
              {session.role}
            </span>
          </div>
        </header>

        {/* Mobile Menu strip */}
        <nav className="md:hidden flex items-center bg-white border-b border-gray-200 p-2 overflow-x-auto no-scrollbar gap-1 shrink-0">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center p-2 text-grey-secondary hover:text-gold min-w-[72px] shrink-0"
            >
              {item.icon}
              <span className="text-[8px] uppercase tracking-wider mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Dynamic page container */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
