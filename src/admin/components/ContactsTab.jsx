import { useState, useEffect } from 'react';

export default function ContactsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesToast, setNotesToast] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Lock background scrolling (native + Lenis) while modal is open
  useEffect(() => {
    if (selected) {
      window.dispatchEvent(new Event('scroll-lock'));
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.dispatchEvent(new Event('scroll-unlock'));
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selected]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        if (selected && selected.id === id) {
          setSelected((prev) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/contacts/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((c) => (c.id === selected.id ? { ...c, notes } : c))
        );
        setSelected((prev) => ({ ...prev, notes }));
        setNotesToast('Notes saved.');
        setTimeout(() => setNotesToast(''), 3000);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((c) => c.id !== id));
        if (selected && selected.id === id) setSelected(null);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.subject || '').toLowerCase().includes(q) ||
        (item.message || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'border-amber-300 bg-amber-50 text-amber-800';
      case 'replied':
        return 'border-blue-300 bg-blue-50 text-blue-800';
      case 'archived':
        return 'border-slate-300 bg-slate-50 text-slate-700';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Contact Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            General patient, caregiver and physician inquiries sent via the Contact page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchContacts}
          className="self-start inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <svg className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['all', 'new', 'replied', 'archived'].map((st) => {
            const count = st === 'all' ? items.length : items.filter((x) => x.status === st).length;
            const isCurrent = filter === st;
            return (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                  isCurrent
                    ? 'bg-[#431B3A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{st}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, email, inquiry…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/10"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading messages…</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-slate-700">No contact messages found</p>
            <p className="text-xs text-slate-400 mt-1">Inbox is all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-[#FAF7F2]/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Email & Phone</th>
                  <th className="px-6 py-4">Subject & Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition">
                    {/* Sender */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 font-bold text-xs text-[#431B3A] ring-1 ring-purple-700/20">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                      </div>
                    </td>

                    {/* Email / Phone */}
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${item.email}`}
                        className="font-medium text-teal-800 hover:underline block"
                      >
                        {item.email}
                      </a>
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="text-[11px] font-mono text-slate-500 hover:underline block mt-0.5"
                        >
                          {item.phone}
                        </a>
                      )}
                    </td>

                    {/* Subject / Message */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 block">
                        {item.subject || 'General Inquiry'}
                      </span>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400 max-w-sm">
                        {item.message}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer outline-none transition ${getStatusColor(
                          item.status
                        )}`}
                      >
                        <option value="new">● New</option>
                        <option value="replied">● Replied</option>
                        <option value="archived">● Archived</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(item);
                            setNotes(item.notes || '');
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 shadow-sm transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Message"
                          className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overscroll-contain overflow-hidden"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div
            className="flex flex-col h-auto max-h-[88vh] w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            data-lenis-prevent
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-[#431B3A] font-bold text-sm ring-1 ring-purple-700/20">
                  {selected.name ? selected.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{selected.name}</h3>
                  <p className="text-xs text-slate-400">
                    Received on {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain"
              data-lenis-prevent
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Inquiry')}`}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-teal-900 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Reply to {selected.email}</span>
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-xs hover:bg-stone-50 transition"
                >
                  <svg className="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call {selected.phone}</span>
                </a>
              )}
            </div>

            {/* Message Body Box */}
            <div className="rounded-2xl border border-slate-100 bg-[#FAF7F2]/60 p-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Subject</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {selected.subject || 'General Inquiry'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 font-medium">Full Message</span>
                <p className="mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200/60">
                  {selected.message}
                </p>
              </div>
            </div>

            {/* Staff Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Staff Internal Notes
                </label>
                {notesToast && (
                  <span className="text-xs font-semibold text-emerald-600">✓ {notesToast}</span>
                )}
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log response details or doctor discussion notes…"
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/10"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="rounded-xl bg-teal-800 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-900 disabled:opacity-60 transition"
                >
                  {savingNotes ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
