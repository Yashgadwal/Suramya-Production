import BookingForm from "@/components/BookingForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Date Availability | Suramya Production Ujjain",
  description: "Check availability of Suramya Production for your wedding, pre-wedding, haldi-mehendi, baby shoot, or other special events in Ujjain.",
};

export default function BookShootPage() {
  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold block">
            Online Scheduling
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-charcoal">
            Check Your Date
          </h1>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
            Fill out the form below to secure your date, check package prices, and get a tailored shoot consultation.
          </p>
          <div className="h-[1px] w-12 bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Multi-step client form */}
        <BookingForm />
      </div>
    </div>
  );
}
