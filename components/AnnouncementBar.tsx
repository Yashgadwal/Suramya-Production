import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AnnouncementBar() {
  try {
    const enabled = await prisma.setting.findUnique({ where: { key: "announcement_enabled" } });
    if (enabled?.value !== "true") return null;

    const text = await prisma.setting.findUnique({ where: { key: "announcement_text" } });
    const link = await prisma.setting.findUnique({ where: { key: "announcement_link" } });

    if (!text?.value) return null;

    return (
      <div className="bg-gold text-ivory text-xs py-2.5 px-4 text-center font-serif tracking-wider transition-all duration-300" suppressHydrationWarning={true}>
        {link?.value ? (
          <Link href={link.value} className="hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
            <span>{text.value}</span>
            <span className="text-[10px]">→</span>
          </Link>
        ) : (
          text.value
        )}
      </div>
    );
  } catch (error) {
    return null;
  }
}
