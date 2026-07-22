import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Suramya Production",
  description: "Read our privacy policies regarding how we collect, store, and process client contact details and booking information at Suramya Production Ujjain.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-beige/40 p-8 sm:p-12 rounded-sm shadow-sm space-y-6">
        <h1 className="font-serif text-3xl text-charcoal">Privacy Policy</h1>
        <span className="text-[10px] tracking-widest text-grey-secondary uppercase block">
          Last Updated: July 2026
        </span>
        <div className="h-[1px] w-full bg-beige/30" />

        <div className="space-y-4 text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
          <p>
            At Suramya Production, accessible from suramyaproduction.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Suramya Production and how we use it.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">1. Information We Collect</h3>
          <p>
            When you use our date availability booking form or contact form, we collect personal information you provide to us, which includes: Full Name, Email Address, Phone Number, WhatsApp Number, and event specifics (dates, venues, budgets).
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">2. How We Use Your Information</h3>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Process your date availability checks and log details inside our CRM.</li>
            <li>Communicate with you regarding packages, quotes, and shoot planning.</li>
            <li>Send notifications via email or WhatsApp concerning your booking schedules.</li>
            <li>Improve, personalize, and expand our website operations.</li>
          </ul>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">3. Media Rights & Watermarking</h3>
          <p>
            As a photography and cinematography studio, we deliver edited visual media through password-secured private client galleries. Unless explicitly agreed in writing in your package contract, Suramya Production retains the right to display selection highlights in our public portfolios and social media channels.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">4. Security of Data</h3>
          <p>
            We implement standard encryption and password hashing protocols to protect database records. We never sell, lease, or distribute customer contact details to third-party marketing services.
          </p>
        </div>
      </div>
    </div>
  );
}
