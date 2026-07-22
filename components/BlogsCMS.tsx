'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  author: string;
  draft: boolean;
  readingTime: number;
}

interface BlogsCMSProps {
  initialBlogs: BlogPost[];
}

export default function BlogsCMS({ initialBlogs }: BlogsCMSProps) {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [activeBlog, setActiveBlog] = useState<Partial<BlogPost> | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('Saumitra Suramya');
  const [draft, setDraft] = useState(false);
  const [readingTime, setReadingTime] = useState('3');

  const handleOpenAdd = () => {
    setActiveBlog(null);
    setTitle('');
    setSlug('');
    setCoverImage('');
    setCategory('Pre-Wedding Tips');
    setContent('');
    setTags('');
    setAuthor('Saumitra Suramya');
    setDraft(false);
    setReadingTime('3');
    setIsEditing(true);
  };

  const handleOpenEdit = (b: BlogPost) => {
    setActiveBlog(b);
    setTitle(b.title);
    setSlug(b.slug);
    setCoverImage(b.coverImage);
    setCategory(b.category);
    setContent(b.content);
    setTags(b.tags);
    setAuthor(b.author);
    setDraft(b.draft);
    setReadingTime(b.readingTime.toString());
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !coverImage || !content || !category) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      id: activeBlog?.id,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      coverImage,
      category,
      content,
      tags,
      author,
      draft,
      readingTime: parseInt(readingTime) || 3,
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post');

      if (activeBlog?.id) {
        setBlogs((prev) => prev.map((b) => (b.id === activeBlog.id ? data : b)));
      } else {
        setBlogs((prev) => [data, ...prev]);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post permanently?')) return;

    try {
      const res = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        router.refresh();
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const autoGenerateSlug = (text: string) => {
    setTitle(text);
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
          <h2 className="font-serif text-lg text-charcoal">Journal Blog CMS</h2>
          <p className="text-gray-400 text-[10px]">Create guides, articles, and planning tips for Ujjain couples.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Add New Post
        </button>
      </div>

      {/* Grid list */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-gray-100 border-b border-gray-100 overflow-hidden">
                <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/95 text-charcoal px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-sm shadow-xs">
                    {b.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {b.draft ? (
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
                  {b.title}
                </h3>
                <p className="text-gray-400 text-[10px]">
                  Author: {b.author} • {b.readingTime} min read
                </p>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="flex-1 py-2 border border-gray-200 hover:border-gold hover:text-gold text-charcoal flex items-center justify-center gap-1 font-serif uppercase tracking-wider text-[9px] focus:outline-none cursor-pointer rounded-sm bg-white"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="py-2 px-3 border border-gray-100 hover:border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center rounded-sm focus:outline-none cursor-pointer bg-white"
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
          <div className="relative bg-white border border-gray-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-serif text-base text-charcoal">
                {activeBlog ? 'Modify Journal Article' : 'Write New Journal Post'}
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
                  <label className="block text-grey-secondary font-semibold uppercase">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    placeholder="e.g. Planning Your Pre-Wedding Shoot"
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
                    placeholder="e.g. planning-pre-wedding-shoot"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Paste /uploads/... image path"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Journal Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  >
                    <option value="Pre-Wedding Tips">Pre-Wedding Tips</option>
                    <option value="Wedding Trends">Wedding Trends</option>
                    <option value="Ritual Guides">Ritual Guides</option>
                    <option value="Outfit Ideas">Outfit Ideas</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. prewedding, locations, ujjain"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-grey-secondary font-semibold uppercase">Article Body Content *</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article details here. Separate paragraphs with double-spacing."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-48 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2 font-semibold uppercase text-[9px] text-grey-secondary border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft}
                    onChange={(e) => setDraft(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded"
                  />
                  <span className="text-charcoal">Save as Draft (Hide from Journal)</span>
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
                  <Save size={14} /> Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
