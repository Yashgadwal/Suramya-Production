'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle, Info, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsWorkspaceProps {
  initialSettings: Record<string, string>;
}

export default function SettingsWorkspace({ initialSettings }: SettingsWorkspaceProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSuccessMsg('Website configurations updated successfully!');
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Title block */}
      <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <h2 className="font-serif text-lg text-charcoal">Global Website Content Manager</h2>
        <p className="text-gray-400 text-[10px]">Edit brand details, timelines, contact links, announcement schedules and SEO settings.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 text-xs p-3.5 border-l-2 border-emerald-500 rounded-r-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-xs p-3.5 border-l-2 border-red-500 rounded-r-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-sm text-charcoal font-semibold pb-2 border-b border-gray-100">
            1. Business Profile & Timings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Business Name</label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Tagline / Mission Copy</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Studio Office Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Operating Business Timings</label>
              <input
                type="text"
                value={settings.timings || ''}
                onChange={(e) => handleInputChange('timings', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & Social channels */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-sm text-charcoal font-semibold pb-2 border-b border-gray-100">
            2. Contact Details & Social Profiles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Primary Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">WhatsApp Chat Link Number</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Instagram URL</label>
              <input
                type="text"
                value={settings.instagram || ''}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Facebook URL</label>
              <input
                type="text"
                value={settings.facebook || ''}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-grey-secondary font-semibold uppercase">Justdial URL</label>
              <input
                type="text"
                value={settings.justdial || ''}
                onChange={(e) => handleInputChange('justdial', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-grey-secondary font-semibold uppercase">Google Maps Embed URL (Iframe Src)</label>
              <textarea
                value={settings.google_maps_embed || ''}
                onChange={(e) => handleInputChange('google_maps_embed', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-16"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Announcement Bar */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-sm text-charcoal font-semibold pb-2 border-b border-gray-100 flex justify-between items-center">
            <span>3. Dynamic Announcement Strip</span>
            <button
              type="button"
              onClick={() => handleInputChange('announcement_enabled', settings.announcement_enabled === 'true' ? 'false' : 'true')}
              className="text-grey-secondary hover:text-gold transition-colors focus:outline-none cursor-pointer"
            >
              {settings.announcement_enabled === 'true' ? (
                <div className="flex items-center gap-1"><ToggleRight size={24} className="text-gold" /> Enabled</div>
              ) : (
                <div className="flex items-center gap-1"><ToggleLeft size={24} /> Disabled</div>
              )}
            </button>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Announcement text</label>
              <input
                type="text"
                value={settings.announcement_text || ''}
                onChange={(e) => handleInputChange('announcement_text', e.target.value)}
                placeholder="e.g. Booking Open for Wedding Season!"
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-grey-secondary font-semibold uppercase">Redirect Link (Optional)</label>
              <input
                type="text"
                value={settings.announcement_link || ''}
                onChange={(e) => handleInputChange('announcement_link', e.target.value)}
                placeholder="e.g. /book"
                className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SEO Areas */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-sm text-charcoal font-semibold pb-2 border-b border-gray-100">
            4. Local SEO Target Areas
          </h3>
          <div className="space-y-2">
            <label className="block text-grey-secondary font-semibold uppercase">Ujjain Service Areas (Comma-separated)</label>
            <input
              type="text"
              value={settings.service_areas || ''}
              onChange={(e) => handleInputChange('service_areas', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
            />
            <p className="text-[10px] text-grey-secondary leading-normal">
              These locations will be showcased inside our regional target section to aid local organic search maps rankings.
            </p>
          </div>
        </div>

        {/* Section 5: Integration Credits & Settings */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-sm text-charcoal font-semibold pb-2 border-b border-gray-100 flex justify-between items-center">
            <span>5. Technical Credits</span>
            <button
              type="button"
              onClick={() => handleInputChange('growth_partner_credit', settings.growth_partner_credit === 'true' ? 'false' : 'true')}
              className="text-grey-secondary hover:text-gold transition-colors focus:outline-none cursor-pointer"
            >
              {settings.growth_partner_credit === 'true' ? (
                <div className="flex items-center gap-1"><ToggleRight size={24} className="text-gold" /> Credit Visible</div>
              ) : (
                <div className="flex items-center gap-1"><ToggleLeft size={24} /> Credit Hidden</div>
              )}
            </button>
          </h3>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm flex items-start gap-3">
            <Info size={16} className="text-gold mt-0.5 shrink-0" />
            <p className="text-[10px] text-grey-secondary leading-normal">
              Toggles the display of the footer attribution: <span className="font-semibold text-charcoal">"Growth Partner: Nexora Scale"</span>. Activating it preserves partner association.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-ivory font-serif uppercase tracking-widest text-[10px] rounded-sm flex items-center gap-2 shadow-md cursor-pointer transition-colors"
          >
            <Save size={14} /> {isSaving ? 'Saving Configurations...' : 'Save Configuration Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
