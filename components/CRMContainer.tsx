'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Upload, Plus, Trash2, Edit, ChevronRight, X, Phone, MessageSquare, Mail, Calendar, MapPin, DollarSign, PlusCircle } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string | Date;
}

interface Lead {
  id: string;
  enquiryId: string;
  shootType: string;
  eventDate: string | Date;
  altDate: string | Date | null;
  city: string;
  venue: string | null;
  guestCount: number | null;
  servicesNeeded: string; // JSON string
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  budget: string | null;
  source: string | null;
  message: string | null;
  status: string;
  quotedAmount: number | null;
  advancePaid: number | null;
  remainingDue: number | null;
  createdAt: string | Date;
  notes: Note[];
}

interface CRMContainerProps {
  initialLeads: Lead[];
}

export default function CRMContainer({ initialLeads }: CRMContainerProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Edit fields
  const [editStatus, setEditStatus] = useState('');
  const [editQuoted, setEditQuoted] = useState('');
  const [editPaid, setEditPaid] = useState('');
  const [editDue, setEditDue] = useState('');
  const [newNote, setNewNote] = useState('');

  // Import states
  const [isImporting, setIsImporting] = useState(false);

  const statuses = [
    'New',
    'Contacted',
    'Follow-Up',
    'Consultation Scheduled',
    'Quote Sent',
    'Negotiation',
    'Booked',
    'Completed',
    'Lost',
    'Spam',
  ];

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.enquiryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.shootType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Open Lead details panel
  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditQuoted(lead.quotedAmount?.toString() || '');
    setEditPaid(lead.advancePaid?.toString() || '');
    setEditDue(lead.remainingDue?.toString() || '');
    setNewNote('');
  };

  // PATCH update lead details
  const handleSaveLeadUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          quotedAmount: editQuoted ? parseFloat(editQuoted) : null,
          advancePaid: editPaid ? parseFloat(editPaid) : null,
          remainingDue: editDue ? parseFloat(editDue) : null,
          noteContent: newNote || undefined,
        }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update');

      // Update local state
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, ...updated, notes: newNote ? [...l.notes, { id: Math.random().toString(), content: newNote, createdBy: 'Admin', createdAt: new Date() }] : l.notes } : l))
      );

      // Refresh details popup state
      setSelectedLead((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updated,
          notes: newNote
            ? [
                ...prev.notes,
                { id: Math.random().toString(), content: newNote, createdBy: 'Admin', createdAt: new Date() },
              ]
            : prev.notes,
        };
      });

      setNewNote('');
      router.refresh();
    } catch (error) {
      alert('Error updating lead.');
    }
  };

  // DELETE lead permanently
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead permanently? This action is irreversible.')) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setSelectedLead(null);
        router.refresh();
      } else {
        alert('Delete failed.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // CSV Export client side
  const handleExportCSV = () => {
    const headers = [
      'Enquiry ID',
      'Name',
      'Email',
      'Phone',
      'WhatsApp',
      'Shoot Type',
      'Event Date',
      'City',
      'Venue',
      'Status',
      'Quoted Amount',
      'Advance Paid',
      'Remaining Due',
    ];

    const rows = filteredLeads.map((l) => [
      l.enquiryId,
      l.name,
      l.email,
      l.phone,
      l.whatsapp,
      l.shootType,
      new Date(l.eventDate).toLocaleDateString('en-IN'),
      l.city,
      l.venue || '',
      l.status,
      l.quotedAmount || 0,
      l.advancePaid || 0,
      l.remainingDue || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `suramya_leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import parser (basic parser for demonstration / local import checks)
  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map((line) => line.trim()).filter((line) => line !== '');
      const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());

      const nameIdx = headers.findIndex((h) => /name/i.test(h));
      const emailIdx = headers.findIndex((h) => /email/i.test(h));
      const phoneIdx = headers.findIndex((h) => /phone/i.test(h));
      const typeIdx = headers.findIndex((h) => /type|shoot/i.test(h));
      const dateIdx = headers.findIndex((h) => /date/i.test(h));
      const cityIdx = headers.findIndex((h) => /city/i.test(h));

      if (nameIdx === -1 || phoneIdx === -1 || emailIdx === -1 || typeIdx === -1) {
        alert('CSV must contain Name, Email, Phone, and Shoot Type columns.');
        setIsImporting(false);
        return;
      }

      let importCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map((col) => col.replace(/"/g, '').trim());
        if (columns.length < headers.length) continue;

        try {
          const payload = {
            name: columns[nameIdx],
            email: columns[emailIdx],
            phone: columns[phoneIdx],
            whatsapp: columns[phoneIdx],
            shootType: columns[typeIdx],
            eventDate: columns[dateIdx] || new Date().toISOString().split('T')[0],
            city: columns[cityIdx] || 'Ujjain',
            servicesNeeded: [columns[typeIdx]],
          };

          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          importCount++;
        } catch (err) {
          console.error('Import line error:', err);
        }
      }

      alert(`Successfully imported ${importCount} leads!`);
      setIsImporting(false);
      window.location.reload();
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-serif text-lg text-charcoal">Lead Manager (CRM)</h2>
          <p className="text-gray-400 text-[10px]">Filter, edit status notes, export lists or upload CSV rosters.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {/* CSV Import */}
          <label className="px-3.5 py-2 border border-gray-200 hover:border-gold hover:text-gold text-grey-secondary bg-white rounded-sm flex items-center gap-1.5 cursor-pointer font-medium font-serif uppercase tracking-wider text-[9px]">
            <Upload size={12} /> {isImporting ? 'Importing...' : 'Import CSV'}
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" disabled={isImporting} />
          </label>
          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-gray-200 hover:border-gold hover:text-gold text-grey-secondary bg-white rounded-sm flex items-center gap-1.5 cursor-pointer font-medium font-serif uppercase tracking-wider text-[9px]"
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID, phone, city or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-gold focus:outline-none rounded-sm bg-gray-50/50 text-[11px] font-sans"
          />
        </div>

        {/* Status selection */}
        <div className="flex items-center gap-2 text-[11px] md:col-span-2 justify-start md:justify-end">
          <span className="text-grey-secondary uppercase font-semibold tracking-wider font-sans text-[10px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50 text-[11px] font-sans"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px] text-xs">
          <thead>
            <tr className="bg-gray-50 text-[10px] text-grey-secondary font-serif uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-semibold">Ref ID</th>
              <th className="p-4 font-semibold">Client</th>
              <th className="p-4 font-semibold">Event Detail</th>
              <th className="p-4 font-semibold">Finance status</th>
              <th className="p-4 font-semibold">CRM Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No matching inquiry records found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const totalVal = lead.quotedAmount || 0;
                const paidVal = lead.advancePaid || 0;
                const dueVal = totalVal - paidVal;

                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-charcoal font-serif">{lead.enquiryId}</td>
                    <td className="p-4 space-y-1">
                      <p className="font-semibold text-charcoal">{lead.name}</p>
                      <p className="text-[10px] text-grey-secondary">{lead.phone} • {lead.email}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      <p className="font-medium text-charcoal">{lead.shootType}</p>
                      <p className="text-[10px] text-grey-secondary">
                        {new Date(lead.eventDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        • {lead.city}
                      </p>
                    </td>
                    <td className="p-4 space-y-0.5 font-medium">
                      <p className="text-charcoal">Total: ₹{totalVal.toLocaleString()}</p>
                      <p className="text-[9px] text-grey-secondary">
                        Paid: <span className="text-emerald-600">₹{paidVal.toLocaleString()}</span> • Due:{' '}
                        <span className={dueVal > 0 ? 'text-red-500 font-semibold' : 'text-gray-400'}>
                          ₹{dueVal.toLocaleString()}
                        </span>
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase ${
                        lead.status === 'New' ? 'bg-amber-100 text-amber-800' :
                        lead.status === 'Booked' ? 'bg-emerald-100 text-emerald-800' :
                        lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenLead(lead)}
                          className="p-1.5 hover:text-gold text-grey-secondary border border-gray-100 hover:border-gold/30 rounded-sm transition-colors focus:outline-none"
                          title="Edit Details / Add Notes"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 hover:text-red-600 text-grey-secondary border border-gray-100 hover:border-red-200 rounded-sm transition-colors focus:outline-none"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details Side-Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal/40 backdrop-blur-xs font-sans text-xs">
          {/* Backdrop Clicker */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedLead(null)} />

          {/* Slider Drawer Panel */}
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto flex flex-col p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <span className="font-serif text-gold tracking-widest uppercase text-[10px]">CRM Client Profile</span>
                <h3 className="font-serif text-lg text-charcoal">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-grey-secondary hover:text-charcoal rounded-full border border-gray-100 hover:bg-gray-50 focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Float */}
            <div className="flex gap-2 bg-gray-50 p-3 rounded-sm border border-gray-100 text-[10px] font-sans">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex-1 text-center py-2 bg-white hover:bg-gray-100 border border-gray-200 text-charcoal flex items-center justify-center gap-1.5 rounded-sm uppercase tracking-wider font-semibold"
              >
                <Phone size={12} /> Call Now
              </a>
              <a
                href={`https://wa.me/${selectedLead.whatsapp.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent(`Hello ${selectedLead.name}, this is Saumitra from Suramya Production concerning your enquiry.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center gap-1.5 rounded-sm uppercase tracking-wider font-semibold"
              >
                <MessageSquare size={12} /> WhatsApp
              </a>
            </div>

            {/* Info details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-charcoal">
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">Reference ID</span>
                <p className="font-serif font-semibold text-sm">{selectedLead.enquiryId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">Budget Range</span>
                <p className="font-medium">{selectedLead.budget || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">Event Type</span>
                <p className="font-medium">{selectedLead.shootType}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">City & Venue</span>
                <p className="font-medium">
                  {selectedLead.city} {selectedLead.venue ? `(${selectedLead.venue})` : ''}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">Target Event Date</span>
                <p className="font-medium flex items-center gap-1">
                  <Calendar size={12} className="text-gold" />
                  {new Date(selectedLead.eventDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block">Inquiry Source</span>
                <p className="font-medium">{selectedLead.source || 'Website Form'}</p>
              </div>
            </div>

            {/* Message details */}
            {selectedLead.message && (
              <div className="bg-ivory/40 p-4 border border-beige/30 rounded-sm">
                <span className="text-[9px] uppercase text-grey-secondary tracking-wider block mb-1">
                  Client Message
                </span>
                <p className="font-sans text-xs text-grey-secondary leading-relaxed font-light">
                  "{selectedLead.message}"
                </p>
              </div>
            )}

            {/* Update details form */}
            <form onSubmit={handleSaveLeadUpdates} className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-serif text-sm text-charcoal font-semibold">Update Lead Status & Finances</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-grey-secondary uppercase font-semibold block">CRM status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-grey-secondary uppercase font-semibold block">Quoted Price (₹)</label>
                  <input
                    type="number"
                    value={editQuoted}
                    onChange={(e) => setEditQuoted(e.target.value)}
                    placeholder="e.g. 95000"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-grey-secondary uppercase font-semibold block">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={editPaid}
                    onChange={(e) => setEditPaid(e.target.value)}
                    placeholder="e.g. 30000"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-grey-secondary uppercase font-semibold block">Remaining Due (₹)</label>
                  <input
                    type="number"
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                    placeholder="e.g. 65000"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Note addition */}
              <div className="space-y-1">
                <label className="text-[10px] text-grey-secondary uppercase font-semibold block">Add Notes</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log follow-up details, customization decisions, or timeline notes here..."
                  className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none bg-gray-50/50 h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gold hover:bg-gold-dark text-ivory font-serif uppercase tracking-wider text-[10px] rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Save Profile Changes
              </button>
            </form>

            {/* Note Log timeline */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h4 className="font-serif text-sm text-charcoal font-semibold">Inquiry Notes History</h4>
              {selectedLead.notes.length === 0 ? (
                <p className="text-gray-400 italic text-[11px]">No notes logged yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 border border-gray-100 rounded-sm space-y-1">
                      <p className="text-charcoal leading-relaxed font-light">{note.content}</p>
                      <div className="flex justify-between items-center text-[9px] text-grey-secondary">
                        <span>Logged by {note.createdBy}</span>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
