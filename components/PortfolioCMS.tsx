'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  clientName: string;
  category: string;
  location: string;
  date: string;
  description: string;
  photographs: string; // JSON string
  featured: boolean;
  draft: boolean;
}

interface PortfolioCMSProps {
  initialProjects: Project[];
}

export default function PortfolioCMS({ initialProjects }: PortfolioCMSProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [activeProject, setActiveProject] = useState<Partial<Project> | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('Wedding');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrlsInput, setPhotoUrlsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [draft, setDraft] = useState(false);

  const categories = ['Wedding', 'Pre-Wedding', 'Haldi', 'Mehendi', 'Bridal', 'Baby', 'Fashion', 'Events'];

  const handleOpenAdd = () => {
    setActiveProject(null);
    setTitle('');
    setSlug('');
    setCoverImage('');
    setClientName('');
    setCategory('Wedding');
    setLocation('');
    setDate('');
    setDescription('');
    setPhotoUrlsInput('');
    setFeatured(false);
    setDraft(false);
    setIsEditing(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setActiveProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setCoverImage(proj.coverImage);
    setClientName(proj.clientName);
    setCategory(proj.category);
    setLocation(proj.location);
    setDate(proj.date);
    setDescription(proj.description);
    setFeatured(proj.featured);
    setDraft(proj.draft);

    try {
      const arr = JSON.parse(proj.photographs);
      setPhotoUrlsInput(arr.join('\n'));
    } catch {
      setPhotoUrlsInput('');
    }

    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !coverImage || !clientName || !location || !date) {
      alert('Please fill out all required fields.');
      return;
    }

    // Split photo URLs input by newline to create array
    const photographsArray = photoUrlsInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    const payload = {
      id: activeProject?.id,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      coverImage,
      clientName,
      category,
      location,
      date,
      description,
      photographs: photographsArray,
      featured,
      draft,
    };

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      if (activeProject?.id) {
        setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? data : p)));
      } else {
        setProjects((prev) => [data, ...prev]);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story permanently?')) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const autoGenerateSlug = (titleText: string) => {
    setTitle(titleText);
    const generated = titleText
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
          <h2 className="font-serif text-lg text-charcoal">Portfolio Manager</h2>
          <p className="text-gray-400 text-[10px]">Create, edit, and feature photography projects and couple stories.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Create New Story
        </button>
      </div>

      {/* Grid List */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-gray-100 border-b border-gray-100 overflow-hidden">
                <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/95 text-charcoal px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm shadow-xs">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="bg-gold text-ivory px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm shadow-xs">
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  {proj.draft ? (
                    <span className="bg-red-500 text-white p-1 rounded-full block" title="Draft">
                      <EyeOff size={12} />
                    </span>
                  ) : (
                    <span className="bg-green-600 text-white p-1 rounded-full block" title="Published">
                      <Eye size={12} />
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-serif text-sm text-charcoal font-semibold tracking-wide line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-gray-400 text-[10px]">
                  Client: {proj.clientName} • Location: {proj.location}
                </p>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="flex-1 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal flex items-center justify-center gap-1 font-serif uppercase tracking-wider text-[9px] focus:outline-none cursor-pointer"
                  >
                    <Edit2 size={12} /> Edit Details
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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
                {activeProject ? 'Modify Story Details' : 'Create New Portfolio Story'}
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
                  <label className="block text-grey-secondary font-semibold uppercase">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    placeholder="e.g. Rahul & Shruti Wedding highlight"
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
                    placeholder="e.g. rahul-shruti-wedding"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Client / Couple Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rahul & Shruti"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Shoot Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Shoot Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nanakheda, Ujjain"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Copy and paste a path from Media Library (e.g. /uploads/image.jpg)"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Description / Story Details</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a short narrative or story of the events..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-20"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">
                    Gallery Photographs (Paste Image URLs, One per Line)
                  </label>
                  <textarea
                    value={photoUrlsInput}
                    onChange={(e) => setPhotoUrlsInput(e.target.value)}
                    placeholder="/uploads/frame1.jpg&#10;/uploads/frame2.jpg"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-28 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-[10px]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase text-[10px]">
                  <input
                    type="checkbox"
                    checked={draft}
                    onChange={(e) => setDraft(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span>Save as Draft (Hidden)</span>
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
                  <Save size={14} /> Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
