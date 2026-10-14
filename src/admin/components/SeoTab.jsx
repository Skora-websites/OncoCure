import { useState, useEffect } from 'react';
import { listPageSeo, updatePageSeo } from '../../lib/pageSeoApi.js';

export default function SeoTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal Form State
  const [formData, setFormData] = useState({
    label: '',
    path: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    canonicalUrl: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listPageSeo();
      setItems(res.items || []);
    } catch {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (editingItem) {
      window.dispatchEvent(new Event('scroll-lock'));
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.dispatchEvent(new Event('scroll-unlock'));
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [editingItem]);

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || '',
      path: item.path || '',
      metaTitle: item.metaTitle || '',
      metaKeywords: item.metaKeywords || '',
      metaDescription: item.metaDescription || '',
      canonicalUrl: item.canonicalUrl || '',
    });
  };

  const handleCloseModal = () => {
    setEditingItem(null);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    try {
      await updatePageSeo(editingItem.id, {
        label: formData.label,
        metaTitle: formData.metaTitle,
        metaKeywords: formData.metaKeywords,
        metaDescription: formData.metaDescription,
        canonicalUrl: formData.canonicalUrl,
      });
      await loadData();
      handleCloseModal();
    } catch (err) {
      alert('Error updating page SEO: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Character Counters
  const titleCount = formData.metaTitle.length;
  const isTitleOver = titleCount > 100;
  const keywordsCount = formData.metaKeywords.length;
  const isKeywordsOver = keywordsCount > 100;
  const descCount = formData.metaDescription.length;
  const isDescOver = descCount > 500;

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Manage SEO
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {items.length} records. One row per page. Leave a field empty to keep the site&apos;s built-in default for that page.
          </p>
        </div>
      </div>

      {/* Pages Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading SEO records…</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-slate-700">No page records found</p>
            <p className="text-xs text-slate-400 mt-1">Seeding will initialize automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-[#FAF7F2]/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">ID</th>
                  <th className="px-6 py-4">Page (route path)</th>
                  <th className="px-6 py-4">Admin Label</th>
                  <th className="px-6 py-4">Meta Title</th>
                  <th className="px-6 py-4">Meta Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <tr key={item.id || item.path} className="hover:bg-[#FAF7F2]/40 transition">
                    {/* ID */}
                    <td className="px-6 py-4 text-center font-mono text-slate-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Route Path */}
                    <td className="px-6 py-4">
                      <code className="rounded-md bg-teal-50 px-2 py-1 font-mono text-xs font-semibold text-teal-900 border border-teal-200/60">
                        {item.path}
                      </code>
                    </td>

                    {/* Admin Label */}
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.label}
                    </td>

                    {/* Meta Title */}
                    <td className="px-6 py-4 max-w-xs">
                      {item.metaTitle ? (
                        <p className="font-medium text-slate-800 truncate" title={item.metaTitle}>
                          {item.metaTitle}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic">Built-in default</span>
                      )}
                    </td>

                    {/* Meta Description */}
                    <td className="px-6 py-4 max-w-sm">
                      {item.metaDescription ? (
                        <p className="line-clamp-2 text-slate-600 leading-relaxed" title={item.metaDescription}>
                          {item.metaDescription}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic">Built-in default</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 shadow-2xs transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit SEO Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs overscroll-contain overflow-hidden"
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="flex h-[90vh] max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200"
            data-lenis-prevent
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#FAF7F2]/80 px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    Edit SEO Meta Tags — {formData.label}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Route-scoped HTML head metadata and search preview
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain"
              data-lenis-prevent
              style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            >
              {/* Row 1: Route Path & Admin Label */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Page (route path) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Page (route path) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.path}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100/80 p-3 font-mono text-xs font-semibold text-slate-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Route this meta applies to. Seeded with the page and not editable.
                  </p>
                </div>

                {/* Admin Label */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Admin Label (how the page is named in the list)
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. Home"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/10"
                  />
                </div>
              </div>

              {/* Meta Tags Subheading Divider */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Meta Tags
                </h3>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Title
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      isTitleOver ? 'text-red-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {titleCount} / 100
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Target < 60-70 characters (leave empty for built-in default)"
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-800 focus:outline-none transition ${
                    isTitleOver
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-200 focus:border-teal-700'
                  }`}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Becomes the &lt;title&gt; tag exactly as typed, with no site name appended.
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Keywords (comma-separated)
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      isKeywordsOver ? 'text-red-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {keywordsCount} / 100
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="e.g. oncology, cancer doctor greater noida, chemotherapy, dr sahil bambroo"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Description
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      isDescOver ? 'text-red-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {descCount} / 500
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Target 150-160 characters for search snippet listings…"
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-800 focus:outline-none transition leading-relaxed ${
                    isDescOver
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-200 focus:border-teal-700'
                  }`}
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Canonical URL (optional, overrides the default page URL)
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="e.g. https://oncocure.co.in/about"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>

              {/* Google Search Live Snippet Preview */}
              <div className="rounded-2xl border border-slate-200/80 bg-[#FAF7F2]/60 p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Google Search Snippet Preview
                </span>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800 text-[9px] font-bold text-white">
                      OC
                    </span>
                    <span className="text-slate-800">oncocure.co.in</span>
                    <span className="text-slate-400">
                      {formData.path === '/' ? '' : `› ${formData.path.replace(/^\//, '')}`}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#1a0dab] hover:underline line-clamp-1 cursor-pointer">
                    {formData.metaTitle || `${formData.label} — Onco Cure Clinic Greater Noida`}
                  </h4>
                  <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {formData.metaDescription ||
                      'Onco Cure Clinic is a specialist oncology and pain clinic in Greater Noida offering medical oncology and cancer care led by Dr. Sahil Bambroo.'}
                  </p>
                </div>
              </div>
            </form>

            {/* Sticky Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-[#FAF7F2]/80 px-6 py-4 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Saving Meta Tags…</span>
                  </>
                ) : (
                  <span>Save Meta Tags →</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
