'use client';

import { useState } from 'react';
import { Upload, Trash2, Copy, FileText, Image as ImageIcon, Video, Check } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  sizeBytes: number;
  createdAt: string;
  isImage: boolean;
  isVideo: boolean;
}

interface MediaLibraryWorkspaceProps {
  initialFiles: MediaFile[];
}

export default function MediaLibraryWorkspace({ initialFiles }: MediaLibraryWorkspaceProps) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // File Upload
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Append newly created file
        const newMedia: MediaFile = {
          name: data.name,
          url: data.url,
          sizeBytes: data.size,
          createdAt: new Date().toISOString(),
          isImage: /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(data.name),
          isVideo: /\.(mp4|webm|ogg|mov)$/i.test(data.name),
        };
        setFiles((prev) => [newMedia, ...prev]);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete File
  const handleDeleteFile = async (name: string) => {
    if (!confirm('Are you sure you want to delete this file permanently from the server? Any content using this link will break.')) return;

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== name));
      } else {
        const err = await res.json();
        alert(err.error || 'Delete failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Copy url to clipboard
  const handleCopyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
            <ImageIcon size={20} className="text-gold" /> Media Library
          </h2>
          <p className="text-gray-400 text-[10px]">Upload photographs and video reels. Copy links to paste in CMS managers.</p>
        </div>
        <div>
          <label className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm cursor-pointer focus:outline-none transition-colors">
            <Upload size={12} /> {isUploading ? 'Uploading...' : 'Upload Media File'}
            <input type="file" onChange={handleUploadFile} className="hidden" disabled={isUploading} />
          </label>
        </div>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <div className="text-center py-24 bg-white border border-gray-200 rounded-sm shadow-sm">
          <p className="font-serif text-sm text-gray-400 tracking-widest">
            Media library is empty. Upload files to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm group hover:shadow-md transition-shadow"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                {file.isImage ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                ) : file.isVideo ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                    <Video size={36} className="text-gold/40" />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-mono">
                      VIDEO
                    </span>
                  </div>
                ) : (
                  <FileText size={36} className="text-gray-300" />
                )}

                {/* Overlays delete & copy */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleCopyUrl(file.url, file.name)}
                    className="p-2 bg-white text-charcoal hover:text-gold rounded-full shadow-md focus:outline-none transition-colors"
                    title="Copy URL path"
                  >
                    {copiedName === file.name ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-full shadow-md focus:outline-none transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info details */}
              <div className="p-3 space-y-1">
                <p className="font-semibold text-charcoal truncate" title={file.name}>
                  {file.name.split('_').slice(1).join('_') || file.name}
                </p>
                <div className="flex justify-between items-center text-[9px] text-grey-secondary font-sans font-light">
                  <span>{formatSize(file.sizeBytes)}</span>
                  <span>
                    {new Date(file.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
