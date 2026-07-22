'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, CheckCircle2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  description: string;
  inclusions: string; // JSON string
  customerType: string;
  displayOrder: number;
  enabled: boolean;
}

interface ServicesCMSProps {
  initialServices: Service[];
}

export default function ServicesCMS({ initialServices }: ServicesCMSProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isEditing, setIsEditing] = useState(false);
  const [activeService, setActiveService] = useState<Partial<Service> | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [description, setDescription] = useState('');
  const [inclusionsInput, setInclusionsInput] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [enabled, setEnabled] = useState(true);

  const handleOpenAdd = () => {
    setActiveService(null);
    setName('');
    setSlug('');
    setFeaturedImage('');
    setDescription('');
    setInclusionsInput('');
    setCustomerType('');
    setDisplayOrder('0');
    setEnabled(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setActiveService(svc);
    setName(svc.name);
    setSlug(svc.slug);
    setFeaturedImage(svc.featuredImage);
    setDescription(svc.description);
    setCustomerType(svc.customerType);
    setDisplayOrder(svc.displayOrder.toString());
    setEnabled(svc.enabled);

    try {
      const arr = JSON.parse(svc.inclusions);
      setInclusionsInput(arr.join('\n'));
    } catch {
      setInclusionsInput('');
    }

    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !featuredImage || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    // Split inclusions input by newline to create array
    const inclusionsArray = inclusionsInput
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const payload = {
      id: activeService?.id,
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      featuredImage,
      description,
      inclusions: inclusionsArray,
      customerType,
      displayOrder: parseInt(displayOrder) || 0,
      enabled,
    };

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save service');

      if (activeService?.id) {
        setServices((prev) => prev.map((s) => (s.id === activeService.id ? data : s)));
      } else {
        setServices((prev) => [...prev, data]);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service permanently?')) return;

    try {
      const res = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const autoGenerateSlug = (text: string) => {
    setName(text);
    const generated = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generated);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-serif text-lg text-charcoal">Services Manager</h2>
          <p className="text-gray-400 text-[10px]">Add, edit, or toggle photography and cinematography services.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Add New Service
        </button>
      </div>

      {/* Grid list */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-gray-100 border-b border-gray-100 overflow-hidden">
                <img src={svc.featuredImage} alt={svc.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm shadow-xs text-white ${
                    svc.enabled ? 'bg-green-600' : 'bg-red-500'
                  }`}>
                    {svc.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-serif text-sm text-charcoal font-semibold tracking-wide line-clamp-1">
                  {svc.name}
                </h3>
                <p className="text-gray-400 text-[10px]">
                  Sort Order: {svc.displayOrder}
                </p>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="flex-1 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal flex items-center justify-center gap-1 font-serif uppercase tracking-wider text-[9px] focus:outline-none cursor-pointer"
                  >
                    Modify Service
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="py-2 px-3 border border-gray-100 hover:border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center rounded-sm focus:outline-none cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
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
                {activeService ? 'Modify Service Profile' : 'Create New Service Listing'}
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
                  <label className="block text-grey-secondary font-semibold uppercase">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    placeholder="e.g. Wedding Cinematography"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. wedding-cinematography"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Featured Image URL *</label>
                  <input
                    type="text"
                    required
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="e.g. /uploads/image.jpg"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Display Sort Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Emotional Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a warm copy detail of what this service delivers..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-20"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Suitable Client Profile</label>
                  <input
                    type="text"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    placeholder="e.g. Couples seeking editorial cinema and dramatic storytelling"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">
                    Service Inclusions (Paste Details, One per Line)
                  </label>
                  <textarea
                    value={inclusionsInput}
                    onChange={(e) => setInclusionsInput(e.target.value)}
                    placeholder="1 candid photographer&#10;1 cinematic director&#10;100 pages leather album"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-24"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-[10px]">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span>Service Enabled (Visible on site)</span>
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
                  <Save size={14} /> Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
