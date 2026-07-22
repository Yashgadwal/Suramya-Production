'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, CheckCircle2, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  type: string;
  review: string;
  rating: number;
  sourceUrl: string | null;
  approved: boolean;
  featured: boolean;
}

interface TestimonialsCMSProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsCMS({ initialTestimonials }: TestimonialsCMSProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [type, setType] = useState('Wedding Shoot');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('5');
  const [sourceUrl, setSourceUrl] = useState('');
  const [approved, setApproved] = useState(true);
  const [featured, setFeatured] = useState(false);

  const handleOpenAdd = () => {
    setActiveTestimonial(null);
    setName('');
    setAvatar('');
    setType('Wedding Shoot');
    setReview('');
    setRating('5');
    setSourceUrl('');
    setApproved(true);
    setFeatured(false);
    setIsEditing(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setActiveTestimonial(t);
    setName(t.name);
    setAvatar(t.avatar || '');
    setType(t.type);
    setReview(t.review);
    setRating(t.rating.toString());
    setSourceUrl(t.sourceUrl || '');
    setApproved(t.approved);
    setFeatured(t.featured);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review) {
      alert('Please fill out Name and Review content.');
      return;
    }

    const payload = {
      id: activeTestimonial?.id,
      name,
      avatar: avatar || null,
      type,
      review,
      rating: parseInt(rating) || 5,
      sourceUrl: sourceUrl || null,
      approved,
      featured,
    };

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save review');

      if (activeTestimonial?.id) {
        setTestimonials((prev) => prev.map((t) => (t.id === activeTestimonial.id ? data : t)));
      } else {
        setTestimonials((prev) => [data, ...prev]);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review permanently?')) return;

    try {
      const res = await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-serif text-lg text-charcoal">Testimonials Manager</h2>
          <p className="text-gray-400 text-[10px]">Add, edit, approve, or feature client reviews.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Add New Review
        </button>
      </div>

      {/* Grid list */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-sm p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {t.avatar && (
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    )}
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-charcoal">{t.name}</h4>
                      <p className="text-[10px] text-grey-secondary">{t.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm text-white ${
                      t.approved ? 'bg-green-600' : 'bg-red-500'
                    }`}>
                      {t.approved ? 'Approved' : 'Hidden'}
                    </span>
                    {t.featured && (
                      <span className="bg-gold text-ivory px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < t.rating ? 'text-gold fill-gold' : 'text-gray-200'}
                    />
                  ))}
                </div>

                <p className="text-gray-500 leading-relaxed font-light italic">"{t.review}"</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="flex-1 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal flex items-center justify-center gap-1 font-serif uppercase tracking-wider text-[9px] focus:outline-none cursor-pointer rounded-sm bg-white"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="py-2 px-3 border border-gray-100 hover:border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center rounded-sm focus:outline-none cursor-pointer bg-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative bg-white border border-gray-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-serif text-base text-charcoal">
                {activeTestimonial ? 'Modify Testimonial' : 'Add New Client Testimonial'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 border border-gray-100 hover:bg-gray-50 rounded-full focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amit & Priya Sharma"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Shoot / Event Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Wedding Shoot"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Client Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="e.g. /uploads/avatar.jpg"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Rating Stars (1-5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Review Text Content *</label>
                  <textarea
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Paste the review left by client..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-24"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Source Link URL (Google Maps / Justdial)</label>
                  <input
                    type="text"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Paste maps review link..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2 font-semibold uppercase text-[9px] text-grey-secondary border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Approve Review</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Feature on Homepage Carousel</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 border border-gray-200 text-charcoal font-serif uppercase tracking-wider text-[10px] rounded-sm focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold hover:bg-gold-dark text-ivory font-serif uppercase tracking-wider text-[10px] rounded-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save size={14} /> Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
