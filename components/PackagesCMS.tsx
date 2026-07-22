'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, CheckCircle2 } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number | null;
  priceType: string;
  description: string;
  hoursCovered: number | null;
  photographersCount: number;
  videographersCount: number;
  deliverables: string; // JSON string
  albumsCount: number;
  droneEnabled: boolean;
  reelsEnabled: boolean;
  highlightFilmEnabled: boolean;
  deliveryWeeks: number;
  badge: string | null;
  featured: boolean;
  order: number;
  visible: boolean;
}

interface PackagesCMSProps {
  initialPackages: Package[];
}

export default function PackagesCMS({ initialPackages }: PackagesCMSProps) {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isEditing, setIsEditing] = useState(false);
  const [activePackage, setActivePackage] = useState<Partial<Package> | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('Starting From');
  const [description, setDescription] = useState('');
  const [hoursCovered, setHoursCovered] = useState('');
  const [photographersCount, setPhotographersCount] = useState('0');
  const [videographersCount, setVideographersCount] = useState('0');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [albumsCount, setAlbumsCount] = useState('0');
  const [droneEnabled, setDroneEnabled] = useState(false);
  const [reelsEnabled, setReelsEnabled] = useState(false);
  const [highlightFilmEnabled, setHighlightFilmEnabled] = useState(false);
  const [deliveryWeeks, setDeliveryWeeks] = useState('6');
  const [badge, setBadge] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState('0');
  const [visible, setVisible] = useState(true);

  const handleOpenAdd = () => {
    setActivePackage(null);
    setName('');
    setPrice('');
    setPriceType('Starting From');
    setDescription('');
    setHoursCovered('');
    setPhotographersCount('0');
    setVideographersCount('0');
    setDeliverablesInput('');
    setAlbumsCount('0');
    setDroneEnabled(false);
    setReelsEnabled(false);
    setHighlightFilmEnabled(false);
    setDeliveryWeeks('6');
    setBadge('');
    setFeatured(false);
    setOrder('0');
    setVisible(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setActivePackage(pkg);
    setName(pkg.name);
    setPrice(pkg.price?.toString() || '');
    setPriceType(pkg.priceType);
    setDescription(pkg.description);
    setHoursCovered(pkg.hoursCovered?.toString() || '');
    setPhotographersCount(pkg.photographersCount.toString());
    setVideographersCount(pkg.videographersCount.toString());
    setAlbumsCount(pkg.albumsCount.toString());
    setDroneEnabled(pkg.droneEnabled);
    setReelsEnabled(pkg.reelsEnabled);
    setHighlightFilmEnabled(pkg.highlightFilmEnabled);
    setDeliveryWeeks(pkg.deliveryWeeks.toString());
    setBadge(pkg.badge || '');
    setFeatured(pkg.featured);
    setOrder(pkg.order.toString());
    setVisible(pkg.visible);

    try {
      const arr = JSON.parse(pkg.deliverables);
      setDeliverablesInput(arr.join('\n'));
    } catch {
      setDeliverablesInput('');
    }

    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      alert('Please fill out Name and Description.');
      return;
    }

    const deliverablesArray = deliverablesInput
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    const payload = {
      id: activePackage?.id,
      name,
      price: price ? parseFloat(price) : null,
      priceType,
      description,
      hoursCovered: hoursCovered ? parseInt(hoursCovered) : null,
      photographersCount: parseInt(photographersCount) || 0,
      videographersCount: parseInt(videographersCount) || 0,
      deliverables: deliverablesArray,
      albumsCount: parseInt(albumsCount) || 0,
      droneEnabled,
      reelsEnabled,
      highlightFilmEnabled,
      deliveryWeeks: parseInt(deliveryWeeks) || 6,
      badge: badge || null,
      featured,
      order: parseInt(order) || 0,
      visible,
    };

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save package');

      if (activePackage?.id) {
        setPackages((prev) => prev.map((p) => (p.id === activePackage.id ? data : p)));
      } else {
        setPackages((prev) => [...prev, data]);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving package');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package permanently?')) return;

    try {
      const res = await fetch('/api/packages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
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
          <h2 className="font-serif text-lg text-charcoal">Packages Manager</h2>
          <p className="text-gray-400 text-[10px]">Add, edit, or toggle pricing plans and details.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Add New Package
        </button>
      </div>

      {/* Grid list */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white border rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${
                pkg.featured ? 'border-gold' : 'border-gray-200'
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-base text-charcoal font-semibold tracking-wide">
                      {pkg.name}
                    </h3>
                    <p className="text-[10px] text-grey-secondary font-semibold uppercase tracking-wider font-sans mt-0.5">
                      Order Index: {pkg.order}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm text-white ${
                      pkg.visible ? 'bg-green-600' : 'bg-red-500'
                    }`}>
                      {pkg.visible ? 'Visible' : 'Hidden'}
                    </span>
                    {pkg.badge && (
                      <span className="bg-gold text-ivory px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-3 border-y border-gray-100">
                  {pkg.price ? (
                    <p className="font-serif text-lg text-gold font-semibold">
                      ₹{pkg.price.toLocaleString()} ({pkg.priceType})
                    </p>
                  ) : (
                    <p className="font-serif text-lg text-gold font-semibold">Request Quote</p>
                  )}
                </div>

                <p className="text-gray-400 leading-relaxed font-light line-clamp-3">{pkg.description}</p>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="flex-1 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal flex items-center justify-center gap-1 font-serif uppercase tracking-wider text-[9px] focus:outline-none cursor-pointer bg-white rounded-sm"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="py-2 px-3 border border-gray-200 hover:border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center rounded-sm focus:outline-none cursor-pointer bg-white"
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
                {activePackage ? 'Modify Package Details' : 'Create New Pricing Package'}
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
                  <label className="block text-grey-secondary font-semibold uppercase">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Signature Wedding Story"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Featured Badge Label</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Most Popular"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Price (₹) (Optional)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 95000 (leave blank for Quote)"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Price Type Label</label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  >
                    <option value="Starting From">Starting From</option>
                    <option value="Fixed">Fixed Price</option>
                    <option value="Request Quote">Request Quote</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Short Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe who this package is for..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-16"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Event Coverage Hours</label>
                  <input
                    type="number"
                    value={hoursCovered}
                    onChange={(e) => setHoursCovered(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Photographers Count</label>
                  <input
                    type="number"
                    value={photographersCount}
                    onChange={(e) => setPhotographersCount(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Videographers Count</label>
                  <input
                    type="number"
                    value={videographersCount}
                    onChange={(e) => setVideographersCount(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Albums Count</label>
                  <input
                    type="number"
                    value={albumsCount}
                    onChange={(e) => setAlbumsCount(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Delivery Timeline (Weeks)</label>
                  <input
                    type="number"
                    value={deliveryWeeks}
                    onChange={(e) => setDeliveryWeeks(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Sort Index Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">
                    Package Deliverables (Paste features, One per Line)
                  </label>
                  <textarea
                    value={deliverablesInput}
                    onChange={(e) => setDeliverablesInput(e.target.value)}
                    placeholder="1 candid photographer & 1 cinematic director&#10;1 premium leather album&#10;Next-day preview teaser"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-24"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 py-2 font-semibold uppercase text-[9px] text-grey-secondary">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={droneEnabled}
                    onChange={(e) => setDroneEnabled(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Drone Coverage</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reelsEnabled}
                    onChange={(e) => setReelsEnabled(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Instagram Reels</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlightFilmEnabled}
                    onChange={(e) => setHighlightFilmEnabled(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Cinematic Highlight Film</span>
                </label>
              </div>

              <div className="flex items-center gap-6 py-2 font-semibold uppercase text-[9px] text-grey-secondary border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Highlight Gold Border</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Visible to Public</span>
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
                  <Save size={14} /> Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
