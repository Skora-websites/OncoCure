import { useState, useEffect } from 'react';
import ServiceEditorModal from './ServiceEditorModal.jsx';

export default function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async (payload, existingId) => {
    if (existingId) {
      const res = await fetch(`/api/services/${existingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update service');
    } else {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create service');
    }
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this clinical oncology service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = services.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        (s.group || '').toLowerCase().includes(q) ||
        (s.summary || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Oncology Clinical Services
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage comprehensive cancer treatment lines, systemic daycare protocols and supportive care.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingService(null);
            setModalOpen(true);
          }}
          className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} active service lines
        </span>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service title or group…"
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
          <div className="py-20 text-center text-xs text-slate-400">Loading services…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-slate-700">No clinical services found</p>
            <p className="text-xs text-slate-400 mt-1">Click &quot;Add New Service&quot; above to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-[#FAF7F2]/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Clinical Group</th>
                  <th className="px-6 py-4">SEO Health</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4">Procedures Covered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((svc) => {
                  const hasFullSeo = Boolean(svc.metaTitle && svc.metaDescription);
                  const hasPartialSeo = Boolean(svc.metaTitle || svc.metaDescription);
                  const isTitleOver = (svc.metaTitle || '').length > 60;
                  const isDescOver = (svc.metaDescription || '').length > 160;

                  return (
                    <tr key={svc.id} className="hover:bg-[#FAF7F2]/40 transition">
                      {/* Service Name & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={svc.image || '/images/photo/consult-care.jpg'}
                            alt=""
                            className="h-11 w-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                            onError={(e) => {
                              e.target.src = '/images/photo/consult-care.jpg';
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{svc.title}</p>
                            <code className="font-mono text-[11px] text-teal-800">/services/{svc.slug}</code>
                          </div>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            svc.accent === 'plum'
                              ? 'bg-purple-50 text-[#431B3A] border border-purple-200'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {svc.group}
                        </span>
                      </td>

                      {/* SEO Health */}
                      <td className="px-6 py-4">
                        {hasFullSeo ? (
                          isTitleOver || isDescOver ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                              <span>⚠</span> Limits Exceeded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              <span>✓</span> SEO Optimal
                            </span>
                          )
                        ) : hasPartialSeo ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                            <span>●</span> Partial SEO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            — Needs SEO
                          </span>
                        )}
                      </td>

                      {/* Summary */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-600 text-xs leading-relaxed">
                          {svc.summary}
                        </p>
                      </td>

                      {/* Covers Count */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {svc.covers?.length || 0} sub-procedures
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService(svc);
                              setModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 shadow-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(svc.id)}
                            title="Delete Service"
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ServiceEditorModal
        service={editingService}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveService}
      />
    </div>
  );
}
