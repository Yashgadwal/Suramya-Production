import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Phone, MessageSquare, Calendar } from "lucide-react";

export default async function WhatsAppFloat() {
  let phone = "+917999615949";
  let whatsapp = "+917999615949";

  try {
    const sPhone = await prisma.setting.findUnique({ where: { key: "phone" } });
    const sWhatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
    
    if (sPhone?.value) phone = sPhone.value.replace(/\s+/g, '');
    if (sWhatsapp?.value) whatsapp = sWhatsapp.value.replace(/\s+/g, '').replace('+', '');
  } catch (error) {
    console.error("WhatsAppFloat DB load error:", error);
  }

  // Pre-filled WhatsApp greeting
  const encodedMsg = encodeURIComponent("Hello Suramya Production, I would like to check availability for a shoot.");
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur-md border-t border-beige/40 shadow-lg lg:hidden block transition-transform duration-300">
      <div className="grid grid-cols-3 divide-x divide-beige/40 h-14">
        {/* Call Button */}
        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center text-charcoal hover:text-gold transition-colors duration-200"
          style={{ minHeight: "44px" }}
        >
          <Phone size={18} />
          <span className="text-[9px] tracking-wider uppercase mt-1 font-sans">Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-charcoal hover:text-gold transition-colors duration-200"
          style={{ minHeight: "44px" }}
        >
          <MessageSquare size={18} className="text-emerald-600" />
          <span className="text-[9px] tracking-wider uppercase mt-1 font-sans">WhatsApp</span>
        </a>

        {/* Book Button */}
        <Link
          href="/book"
          className="flex flex-col items-center justify-center bg-gold text-ivory hover:bg-gold-dark transition-colors duration-200"
          style={{ minHeight: "44px" }}
        >
          <Calendar size={18} />
          <span className="text-[9px] tracking-wider uppercase mt-1 font-sans font-medium">Book Date</span>
        </Link>
      </div>
    </div>
  );
}
