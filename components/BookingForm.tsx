'use client';

import { useState } from 'react';
import { Check, Calendar, ArrowRight, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    shootType: '',
    eventDate: '',
    altDate: '',
    city: '',
    venue: '',
    guestCount: '',
    servicesNeeded: [] as string[],
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    budget: '',
    source: '',
    message: '',
  });

  const shootTypes = [
    'Wedding',
    'Pre-Wedding',
    'Engagement',
    'Haldi or Mehendi',
    'Baby Shoot',
    'Maternity Shoot',
    'Fashion',
    'Event',
    'Other',
  ];

  const requirementsList = [
    'Photography',
    'Cinematography',
    'Candid photography',
    'Traditional photography',
    'Drone Coverage',
    'Premium Wedding Album',
    'Vertical Reels editing',
    'Same-day wedding highlight edit',
    'Live streaming',
  ];

  const budgets = [
    'Below ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,00,000',
    '₹2,00,000 - ₹3,50,000',
    'Above ₹3,50,000',
  ];

  const sources = [
    'Instagram',
    'Facebook',
    'Google Search',
    'Justdial',
    'Friend/Family Referral',
    'Saw our work live',
    'Other',
  ];

  const handleCheckboxChange = (req: string) => {
    setFormData((prev) => {
      const services = prev.servicesNeeded.includes(req)
        ? prev.servicesNeeded.filter((r) => r !== req)
        : [...prev.servicesNeeded, req];
      return { ...prev, servicesNeeded: services };
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.shootType) {
      setErrorMsg('Please select a shoot type.');
      return;
    }
    if (step === 2 && (!formData.eventDate || !formData.city)) {
      setErrorMsg('Event date and city are required.');
      return;
    }
    setErrorMsg(null);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg('Name, Phone, and Email are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Submission failed');

      setEnquiryId(result.enquiryId);
      setStep(5); // Success step
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Message Redirect
  const handleWhatsAppRedirect = () => {
    if (!enquiryId) return;
    const cleanWhatsapp = "917999615949";
    const msg = `Hello Suramya Production, I would like to check availability for my ${formData.shootType} on ${formData.eventDate} in ${formData.city}. My enquiry ID is ${enquiryId}.`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-beige/40 p-6 sm:p-10 rounded-sm shadow-sm">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full bg-beige/25 h-1.5 rounded-full mb-8 relative">
          <div
            className="bg-gold h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
          <div className="flex justify-between items-center text-[10px] tracking-wider text-grey-secondary uppercase mt-2 font-sans">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Shoot Type'}
              {step === 2 && 'Event Details'}
              {step === 3 && 'Requirements'}
              {step === 4 && 'Your Details'}
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-xs p-3.5 mb-6 border-l-2 border-red-500 rounded-r-sm font-sans">
          {errorMsg}
        </div>
      )}

      {/* STEP 1: SHOOT TYPE */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">What type of shoot are we planning?</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {shootTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, shootType: type })}
                className={`py-3.5 px-4 text-xs font-sans tracking-wider uppercase border text-center transition-colors focus:outline-none cursor-pointer rounded-sm ${
                  formData.shootType === type
                    ? 'border-gold bg-gold text-ivory font-medium'
                    : 'border-beige hover:border-gold hover:text-gold text-charcoal'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-beige/30">
            <button
              onClick={handleNext}
              className="px-6 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              Next Step <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EVENT DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Tell us about the event schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs">
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Event Date *</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Alternative Date (Optional)</label>
              <input
                type="date"
                value={formData.altDate}
                onChange={(e) => setFormData({ ...formData, altDate: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Event City *</label>
              <input
                type="text"
                placeholder="e.g. Ujjain"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Venue (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Nanakheda resort"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Approximate Guest Count (Optional)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-beige/30">
            <button
              onClick={handleBack}
              className="px-6 py-3.5 border border-gold hover:bg-gold hover:text-ivory text-gold font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              Next Step <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REQUIREMENTS */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">Select the services you need</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            {requirementsList.map((req) => {
              const isChecked = formData.servicesNeeded.includes(req);
              return (
                <button
                  key={req}
                  type="button"
                  onClick={() => handleCheckboxChange(req)}
                  className={`flex items-center gap-3 p-3.5 border text-left rounded-sm cursor-pointer transition-colors ${
                    isChecked
                      ? 'border-gold bg-gold/5 text-charcoal font-medium'
                      : 'border-beige hover:border-gold/50 text-grey-secondary'
                  }`}
                >
                  <span className={`w-4 h-4 border flex items-center justify-center rounded-sm ${
                    isChecked ? 'border-gold bg-gold text-ivory' : 'border-beige'
                  }`}>
                    {isChecked && <Check size={10} />}
                  </span>
                  <span>{req}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-6 border-t border-beige/30">
            <button
              onClick={handleBack}
              className="px-6 py-3.5 border border-gold hover:bg-gold hover:text-ivory text-gold font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3.5 bg-gold hover:bg-gold-dark text-ivory font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              Next Step <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONTACT & DETAILS */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">How can we contact you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs">
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold font-sans">Full Name *</label>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Email Address *</label>
              <input
                type="email"
                placeholder="yourname@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Phone Number *</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">WhatsApp Number *</label>
              <input
                type="tel"
                placeholder="For instant quotation sharing"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Estimated Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
              >
                <option value="">Select Range</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">How did you hear about us?</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
              >
                <option value="">Select Source</option>
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="block uppercase text-charcoal tracking-wide font-semibold">Additional Event Info / Message</label>
              <textarea
                placeholder="Share any special concept details, timeline timings or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm h-28 bg-ivory/10 font-sans"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-beige/30">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3.5 border border-gold hover:bg-gold hover:text-ivory text-gold font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-ivory font-serif text-xs tracking-widest uppercase flex items-center gap-2 rounded-sm cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'} <Send size={14} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: SUCCESS & WHATSAPP REDIRECT */}
      {step === 5 && (
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center text-emerald-600">
            <CheckCircle2 size={64} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">Inquiry Submitted Successfully!</h2>
            <p className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-gold font-medium">
              Enquiry ID: <span className="font-bold underline">{enquiryId}</span>
            </p>
          </div>
          <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light max-w-md mx-auto">
            Thank you for checking date availability with Suramya Production. We have logged your request and our creative director will reach out to you shortly.
          </p>
          <div className="pt-6 space-y-4">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-ivory font-serif text-[10px] tracking-widest uppercase flex items-center justify-center gap-2.5 rounded-none shadow-sm transition-all duration-300 hover:tracking-[0.15em] cursor-pointer"
            >
              Open WhatsApp for Fast Response
            </button>
            <p className="text-[10px] font-sans text-grey-secondary italic block">
              Opens WhatsApp chat with your pre-filled inquiry details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
