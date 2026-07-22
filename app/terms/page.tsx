import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Suramya Production",
  description: "Read the service terms and conditions, advance booking fees guidelines, and delivery timelines policies for Suramya Production Ujjain.",
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24 px-6 bg-ivory font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-beige/40 p-8 sm:p-12 rounded-sm shadow-sm space-y-6">
        <h1 className="font-serif text-3xl text-charcoal">Terms and Conditions</h1>
        <span className="text-[10px] tracking-widest text-grey-secondary uppercase block">
          Last Updated: July 2026
        </span>
        <div className="h-[1px] w-full bg-beige/30" />

        <div className="space-y-4 text-xs sm:text-sm text-grey-secondary leading-relaxed font-light">
          <p>
            Welcome to Suramya Production. By booking our services, scheduling dates, or browsing our website, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">1. Booking Advance & Confirmation</h3>
          <p>
            Dates are reserved only upon the receipt of an advance booking deposit (standard 30% of the quoted package amount) and the signing of the shoot contract. Tentative inquiries do not hold or lock dates in our calendar.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">2. Cancellation & Postponement</h3>
          <p>
            Advance payments are non-refundable since we block the date and turn down other potential clients for your slot. In the event of postponement, we will accommodate the new date subject to team availability and potential rescheduling fees.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">3. Delivery Timelines</h3>
          <p>
            Our standard editorial post-production workflow requires:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>4 to 6 weeks for fully edited digital photographs.</li>
            <li>6 to 8 weeks for final cinematographic wedding films and teasers.</li>
            <li>Album delivery is scheduled 3 weeks following the client's final selection approval.</li>
          </ul>
          <p>
            Express editing requests are subject to additional surcharge fees.
          </p>
          <h3 className="font-serif text-sm font-semibold text-charcoal pt-2 uppercase">4. Copyright and Usage Rights</h3>
          <p>
            Suramya Production retains the copyright to all raw and edited visual materials captured during events. Clients receive personal reproduction rights for print and social media sharing. Commercial licensing or redistribution is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
