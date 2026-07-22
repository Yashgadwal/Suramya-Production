import type { Metadata } from "next";
import { Playfair_Display, Inter, Rozha_One } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Script from "next/script";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const rozha = Rozha_One({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-rozha",
});

export async function generateMetadata(): Promise<Metadata> {
  let title = "Suramya Production | Wedding Photography & Cinematography in Ujjain";
  let description = "Suramya Production is Ujjain's premium wedding photography and cinematography studio. We capture relationships, rituals, and real emotions.";

  try {
    const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_global_title" } });
    const descSetting = await prisma.setting.findUnique({ where: { key: "seo_global_description" } });
    if (titleSetting?.value) title = titleSetting.value;
    if (descSetting?.value) description = descSetting.value;
  } catch (error) {
    console.error("Failed to load metadata from database, using defaults");
  }

  return {
    title,
    description,
    viewport: "width=device-width, initial-scale=1, maximum-scale=5",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let businessName = "Suramya Production";

  try {
    const nameSetting = await prisma.setting.findUnique({ where: { key: "business_name" } });
    if (nameSetting?.value) businessName = nameSetting.value;
  } catch (error) {
    console.error("Failed to load business name in layout");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const isHomepage = pathname === "/";

  const mainPaddingClass = isHomepage || isAdmin
    ? "flex-grow pb-14 lg:pb-0"
    : "flex-grow pt-20 lg:pt-24 pb-14 lg:pb-0";

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${rozha.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <Script
          id="cleanup-extension-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const clean = () => {
                  document.querySelectorAll('[bis_skin_checked]').forEach((el) => {
                    el.removeAttribute('bis_skin_checked');
                  });
                };
                const observer = new MutationObserver(() => {
                  clean();
                });
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked']
                });
                document.addEventListener('DOMContentLoaded', clean);
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-sans selection:bg-gold/20 selection:text-gold" suppressHydrationWarning={true}>
        {/* Announcement Bar */}
        {!isAdmin && <AnnouncementBar />}

        {/* Global Navigation Header */}
        {!isAdmin && <Navbar businessName={businessName} />}

        {/* Main Content Area */}
        <main className={mainPaddingClass}>{children}</main>

        {/* Global Footer */}
        {!isAdmin && <Footer />}

        {/* Sticky Action Navigation (Mobile Only) */}
        {!isAdmin && <WhatsAppFloat />}
      </body>
    </html>
  );
}
