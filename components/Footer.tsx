import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Footer() {
  let businessName = "Suramya Production";
  let phone = "+91 7999615949";
  let whatsapp = "+91 7999615949";
  let address = "Nanakheda, Ujjain, Madhya Pradesh";
  let instagram = "https://www.instagram.com/suramya_production/";
  let facebook = "https://www.facebook.com/saumitraphotography/";
  let justdial = "";
  let showCredit = true;

  try {
    const sBusinessName = await prisma.setting.findUnique({ where: { key: "business_name" } });
    const sPhone = await prisma.setting.findUnique({ where: { key: "phone" } });
    const sWhatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
    const sAddress = await prisma.setting.findUnique({ where: { key: "address" } });
    const sInstagram = await prisma.setting.findUnique({ where: { key: "instagram" } });
    const sFacebook = await prisma.setting.findUnique({ where: { key: "facebook" } });
    const sJustdial = await prisma.setting.findUnique({ where: { key: "justdial" } });
    const sCredit = await prisma.setting.findUnique({ where: { key: "growth_partner_credit" } });

    if (sBusinessName?.value) businessName = sBusinessName.value;
    if (sPhone?.value) phone = sPhone.value;
    if (sWhatsapp?.value) whatsapp = sWhatsapp.value;
    if (sAddress?.value) address = sAddress.value;
    if (sInstagram?.value) instagram = sInstagram.value;
    if (sFacebook?.value) facebook = sFacebook.value;
    if (sJustdial?.value) justdial = sJustdial.value;
    if (sCredit?.value) showCredit = sCredit.value === "true";
  } catch (error) {
    console.error("Footer db read error, using defaults:", error);
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ivory border-t border-beige/40 text-charcoal py-16 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex flex-col">
            <span className="font-hindi text-2xl tracking-wide text-charcoal">
              सुरम्या प्रोडक्शन
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-grey-secondary -mt-1 pl-0.5">
              STUDIO
            </span>
          </Link>
          <p className="text-xs text-grey-secondary leading-relaxed font-sans max-w-xs">
            We don\'t simply photograph weddings. We preserve relationships, rituals, and real emotions in Ujjain and beyond.
          </p>
          <div className="flex space-x-4 pt-2">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-secondary hover:text-gold text-xs tracking-wider uppercase font-serif"
              >
                Instagram
              </a>
            )}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-secondary hover:text-gold text-xs tracking-wider uppercase font-serif"
              >
                Facebook
              </a>
            )}
            {justdial && (
              <a
                href={justdial}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-secondary hover:text-gold text-xs tracking-wider uppercase font-serif"
              >
                Justdial
              </a>
            )}
          </div>
        </div>

        {/* Navigation Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-widest uppercase text-gold">Explore</h3>
          <ul className="space-y-2 text-xs font-sans tracking-wide text-grey-secondary">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-gold transition-colors">Portfolio</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
            </li>
            <li>
              <Link href="/films" className="hover:text-gold transition-colors">Wedding Films</Link>
            </li>
            <li>
              <Link href="/packages" className="hover:text-gold transition-colors">Packages & Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-widest uppercase text-gold">Contact</h3>
          <ul className="space-y-2.5 text-xs font-sans text-grey-secondary">
            <li>
              <span className="block text-[10px] uppercase text-charcoal font-semibold tracking-wider">Studio Address</span>
              <span className="block mt-0.5">{address}</span>
            </li>
            <li>
              <span className="block text-[10px] uppercase text-charcoal font-semibold tracking-wider">Phone & WhatsApp</span>
              <a href={`tel:${phone}`} className="block hover:text-gold mt-0.5">{phone}</a>
            </li>
          </ul>
        </div>

        {/* Policies Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-serif text-sm tracking-widest uppercase text-gold">Studio Portal</h3>
          <ul className="space-y-2 text-xs font-sans tracking-wide text-grey-secondary">
            <li>
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-gold transition-colors">Admin Login</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-beige/40 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-grey-secondary font-sans">
        <p>© {currentYear} {businessName}. All rights reserved.</p>
        {showCredit && (
          <p className="mt-2 md:mt-0 tracking-wider">
            Growth Partner:{" "}
            <a
              href="https://instagram.com/nexora.scale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-semibold"
            >
              Nexora Scale
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
