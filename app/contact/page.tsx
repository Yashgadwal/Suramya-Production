import { prisma } from "@/lib/prisma";
import { MapPin, Phone, Mail, Clock, Globe2 } from "lucide-react";
import ContactForm from "./ContactForm";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us | Suramya Production Ujjain",
  description: "Get in touch with Suramya Production in Ujjain. Call or WhatsApp +91 7999615949, visit our Nanakheda studio, or submit an email enquiry.",
};

export default async function ContactPage() {
  let phone = "+91 7999615949";
  let whatsapp = "+91 7999615949";
  let address = "Nanakheda, Ujjain, Madhya Pradesh";
  let timings = "Monday - Sunday: 10:00 AM - 8:00 PM";
  let instagram = "";
  let facebook = "";
  let justdial = "";
  let mapEmbed = "";

  try {
    const sPhone = await prisma.setting.findUnique({ where: { key: "phone" } });
    const sWhatsapp = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
    const sAddress = await prisma.setting.findUnique({ where: { key: "address" } });
    const sTimings = await prisma.setting.findUnique({ where: { key: "timings" } });
    const sInsta = await prisma.setting.findUnique({ where: { key: "instagram" } });
    const sFb = await prisma.setting.findUnique({ where: { key: "facebook" } });
    const sJd = await prisma.setting.findUnique({ where: { key: "justdial" } });
    const sMap = await prisma.setting.findUnique({ where: { key: "google_maps_embed" } });

    if (sPhone?.value) phone = sPhone.value;
    if (sWhatsapp?.value) whatsapp = sWhatsapp.value;
    if (sAddress?.value) address = sAddress.value;
    if (sTimings?.value) timings = sTimings.value;
    if (sInsta?.value) instagram = sInsta.value;
    if (sFb?.value) facebook = sFb.value;
    if (sJd?.value) justdial = sJd.value;
    if (sMap?.value) mapEmbed = sMap.value;
  } catch (error) {
    console.error("Failed to load settings in Contact Page:", error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Contact Our Studio
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            We would love to hear about your celebration plans. Call us, chat on WhatsApp, visit our Ujjain studio, or send a digital inquiry.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Details & Map */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Address */}
              <div className="space-y-2 border border-beige/40 bg-white p-5 rounded-sm">
                <MapPin className="text-gold" size={20} />
                <h4 className="font-serif text-sm tracking-wide text-charcoal">Studio Address</h4>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                  {address}
                </p>
                <p className="text-[10px] font-sans text-amber-600 italic">Needs verification</p>
              </div>

              {/* Phone & Chat */}
              <div className="space-y-2 border border-beige/40 bg-white p-5 rounded-sm">
                <Phone className="text-gold" size={20} />
                <h4 className="font-serif text-sm tracking-wide text-charcoal">Call & WhatsApp</h4>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                  Phone: <a href={`tel:${phone}`} className="hover:text-gold font-medium">{phone}</a>
                </p>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                  WhatsApp: <a href={`https://wa.me/${whatsapp.replace(/\s+/g, '').replace('+', '')}`} className="hover:text-gold font-medium">{whatsapp}</a>
                </p>
              </div>

              {/* Timings */}
              <div className="space-y-2 border border-beige/40 bg-white p-5 rounded-sm">
                <Clock className="text-gold" size={20} />
                <h4 className="font-serif text-sm tracking-wide text-charcoal">Business Timings</h4>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                  {timings}
                </p>
              </div>

              {/* Social Channels */}
              <div className="space-y-2 border border-beige/40 bg-white p-5 rounded-sm">
                <Globe2 className="text-gold" size={20} />
                <h4 className="font-serif text-sm tracking-wide text-charcoal">Social Profiles</h4>
                <div className="flex flex-col gap-1.5 text-xs text-grey-secondary font-sans font-light">
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      Instagram
                    </a>
                  )}
                  {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                      Facebook
                    </a>
                  )}
                  {justdial && (
                    <a href={justdial} target="_blank" rel="noopener noreferrer" className="hover:text-gold truncate max-w-[200px]">
                      Justdial
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map Iframe Embed */}
            {mapEmbed && (
              <div className="border border-beige/40 rounded-sm overflow-hidden aspect-video shadow-sm h-[300px]">
                <iframe
                  src={mapEmbed}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Contact Form component */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
