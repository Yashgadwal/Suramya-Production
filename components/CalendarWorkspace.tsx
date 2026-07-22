'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Plus, Calendar as CalendarIcon, Trash2, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  type: string; // Booking, Tentative, Follow-up, Editing Deadline, Delivery Date
  notes: string | null;
  color: string;
}

interface CalendarWorkspaceProps {
  initialEvents: CalendarEvent[];
}

export default function CalendarWorkspace({ initialEvents }: CalendarWorkspaceProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Manual block form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('Booking');
  const [newNotes, setNewNotes] = useState('');
  const [newColor, setNewColor] = useState('gold');

  // Conflict state: date -> list of events on that date
  const [conflicts, setConflicts] = useState<Record<string, CalendarEvent[]>>({});

  useEffect(() => {
    // Detect conflicts: group events by date
    const groups: Record<string, CalendarEvent[]> = {};
    events.forEach((evt) => {
      const dStr = evt.date; // already YYYY-MM-DD
      if (!groups[dStr]) groups[dStr] = [];
      groups[dStr].push(evt);
    });

    // Keep groups that have > 1 shoot/booking type event
    const conflictGroups: Record<string, CalendarEvent[]> = {};
    Object.entries(groups).forEach(([date, groupList]) => {
      const shootEvents = groupList.filter(e => e.type === 'Booking' || e.type === 'Tentative');
      if (shootEvents.length > 1) {
        conflictGroups[date] = shootEvents;
      }
    });

    setConflicts(conflictGroups);
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Create manual block/event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          date: newDate,
          type: newType,
          notes: newNotes,
          color: newColor,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => [...prev, { ...data, date: data.date.split('T')[0] }]);
        setShowAddForm(false);
        setNewTitle('');
        setNewDate('');
        setNewNotes('');
      } else {
        alert('Failed to save block.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete manual event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Remove this event block?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert('Delete failed.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Render Calendar Grid Days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayIndex }, (_, i) => null);
  const gridCells = [...blanks, ...daysArray];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
        <div>
          <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
            <CalendarIcon size={20} className="text-gold" /> Booking Calendar
          </h2>
          <p className="text-gray-400 text-[10px]">Track events, block dates, and inspect shoot schedule conflicts.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-ivory font-serif text-[10px] tracking-wider uppercase rounded-sm flex items-center gap-1.5 shadow-sm focus:outline-none cursor-pointer"
        >
          <Plus size={12} /> Add Custom Block
        </button>
      </div>

      {/* Date conflict warnings alert box */}
      {Object.keys(conflicts).length > 0 && (
        <div className="bg-amber-50 border-l-2 border-amber-500 p-4 text-amber-900 rounded-r-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={16} />
            <span>Double-Booking Schedule Conflicts Detected!</span>
          </div>
          <div className="space-y-1 pl-6">
            {Object.entries(conflicts).map(([date, eventList]) => (
              <p key={date}>
                On <span className="font-bold">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>: {eventList.map(e => `"${e.title}"`).join(' and ')} overlap.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar visual widget */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="font-serif text-base text-charcoal">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 border border-gray-200 hover:border-gold rounded-sm transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 border border-gray-200 hover:border-gold rounded-sm transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-gray-500 font-semibold uppercase tracking-wider mb-2 text-[9px]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-[300px]">
            {gridCells.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={idx} className="bg-gray-50/50 rounded-sm border border-gray-100/50" />;
              }

              const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => e.date === dStr);
              const hasConflict = !!conflicts[dStr];

              return (
                <div
                  key={idx}
                  className={`bg-white border p-2 rounded-sm flex flex-col justify-between items-start min-h-[55px] ${
                    hasConflict ? 'border-amber-400 bg-amber-50/10' : 'border-gray-100'
                  }`}
                >
                  <span className={`font-semibold text-[10px] ${hasConflict ? 'text-amber-700' : 'text-charcoal'}`}>
                    {dayNum}
                  </span>
                  
                  <div className="w-full space-y-1 mt-1">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`px-1 py-0.5 rounded-sm text-[8px] truncate leading-tight font-medium text-white ${
                          evt.color === 'red' ? 'bg-red-500' :
                          evt.color === 'blue' ? 'bg-blue-500' :
                          evt.color === 'green' ? 'bg-emerald-600' :
                          'bg-gold'
                        }`}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Panel: Blocks list & form */}
        <div className="space-y-6">
          {/* Add custom block Form */}
          {showAddForm && (
            <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-sm text-charcoal">Add Custom Calendar Block</h3>
              <form onSubmit={handleAddEvent} className="space-y-3 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Editing Deadline: Devashish"
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-grey-secondary font-semibold uppercase">Event Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                    >
                      <option value="Booking">Booking</option>
                      <option value="Tentative">Tentative</option>
                      <option value="Editing Deadline">Editing Deadline</option>
                      <option value="Delivery Date">Delivery Date</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-grey-secondary font-semibold uppercase">Highlight Color</label>
                    <select
                      value={newColor}
                      onChange={(e) => {
                        setNewColor(e.target.value);
                      }}
                      className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none"
                    >
                      <option value="gold">Gold (Shoots)</option>
                      <option value="blue">Blue (Tentative)</option>
                      <option value="green">Green (Delivery)</option>
                      <option value="red">Red (Deadline)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-grey-secondary font-semibold uppercase">Notes</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Provide details..."
                    className="w-full p-2 border border-gray-200 rounded-sm focus:border-gold focus:outline-none h-16"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold hover:bg-gold-dark text-ivory font-serif uppercase tracking-wider text-[10px] rounded-sm cursor-pointer shadow-sm"
                >
                  Save Schedule Block
                </button>
              </form>
            </div>
          )}

          {/* Agenda Event list */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-sm text-charcoal">Schedule Agenda</h3>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-1">
              {events.map((evt) => (
                <div key={evt.id} className="py-3 flex justify-between items-start text-xs">
                  <div className="space-y-1 max-w-[80%]">
                    <p className="font-semibold text-charcoal">{evt.title}</p>
                    <p className="text-[10px] text-grey-secondary flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(evt.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {evt.notes && <p className="text-[9px] text-gray-400 leading-normal">{evt.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1 hover:text-red-600 text-grey-secondary focus:outline-none"
                    title="Remove block"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
