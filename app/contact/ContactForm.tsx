'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });

  const subjects = [
    'General Enquiry',
    'Wedding Photography',
    'Pre-Wedding Shoot',
    'Baby & Maternity Shoot',
    'Collaboration / Marketing',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Treat contact form as a lead submission
      const payload = {
        shootType: formData.subject,
        eventDate: new Date().toISOString().split('T')[0], // default today
        city: 'Ujjain', // default
        servicesNeeded: JSON.stringify([formData.subject]),
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.phone, // fallback to phone
        email: formData.email,
        source: 'Contact Form',
        message: formData.message,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Submission failed');

      setEnquiryId(result.enquiryId);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const handleWhatsAppRedirect = () => {
      const cleanWhatsapp = "917999615949";
      const msg = `Hello Suramya Production, I just submitted an inquiry on the contact form. Name: ${formData.name}, Phone: ${formData.phone}, Subject: ${formData.subject}. Message: ${formData.message}. Reference ID: ${enquiryId || ''}`;
      window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
      <div className="bg-white border border-beige/40 p-8 rounded-sm shadow-sm text-center space-y-6">
        <div className="flex justify-center text-emerald-600">
          <CheckCircle2 size={54} className="animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-charcoal font-semibold">Enquiry Submitted Successfully!</h3>
          {enquiryId && (
            <p className="font-sans text-[10px] tracking-widest uppercase text-gold font-medium">
              Reference ID: <span className="font-bold underline">{enquiryId}</span>
            </p>
          )}
        </div>
        <p className="font-sans text-xs sm:text-sm text-grey-secondary leading-relaxed font-light max-w-md mx-auto">
          Thank you for contacting Suramya Production. We have logged your request. You can also start a direct WhatsApp chat to secure a faster response.
        </p>
        <div className="pt-4 space-y-3">
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-ivory font-serif text-[10px] tracking-widest uppercase flex items-center justify-center gap-2.5 rounded-none shadow-sm transition-all duration-300 hover:tracking-[0.15em] cursor-pointer"
          >
            Open WhatsApp for Fast Response
          </button>
          <p className="text-[9px] font-sans text-grey-secondary italic block">
            Opens WhatsApp chat with your pre-filled inquiry details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-beige/40 p-6 sm:p-8 rounded-sm shadow-sm space-y-6">
      <h3 className="font-serif text-xl text-charcoal">Send Us a Message</h3>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-xs p-3.5 border-l-2 border-red-500 rounded-r-sm font-sans">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="space-y-2">
          <label className="block uppercase text-charcoal tracking-wide font-semibold">Your Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block uppercase text-charcoal tracking-wide font-semibold">Email Address *</label>
            <input
              type="email"
              placeholder="name@email.com"
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
        </div>

        <div className="space-y-2">
          <label className="block uppercase text-charcoal tracking-wide font-semibold">Inquiry Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block uppercase text-charcoal tracking-wide font-semibold">Your Message *</label>
          <textarea
            placeholder="Describe your event timeline, venue locations, or requirements in detail..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm h-32 bg-ivory/10 font-sans"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-ivory font-serif text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm cursor-pointer shadow-sm transition-all duration-300"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={14} />
        </button>
      </form>
    </div>
  );
}
