import { useState, useEffect } from 'react';
import BlogEditorModal from './BlogEditorModal.jsx';

export default function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?limit=100');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSaveBlog = async (payload, existingId) => {
    if (existingId) {
      const res = await fetch(`/api/blogs/${existingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update blog');
      }
    } else {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create blog');
      }
    }
    fetchBlogs();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this educational article?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id && b.slug !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const categories = [
    '',
    'Oncology',
    'Understanding Cancer',
    'Treatment & Therapies',
    'Pain & Symptom Care',
    'Prevention & Screening',
    'Living Well',
  ];

  const filtered = blogs.filter((b) => {
    if (filterCategory && b.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return b.title.toLowerCase().includes(q) || (b.slug || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Educational Articles & Blogs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and manage cancer care literature with live SEO meta counters, automatic slugify and Rich Paste.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBlog(null);
            setModalOpen(true);
          }}
          className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Write New Article</span>
        </button>
      </div>

      {/* Toolbar: Category Pills & Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isCurrent = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-teal-800 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat || 'All Categories'}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or slug…"
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

      {/* Articles Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading articles…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-slate-700">No educational articles found</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Write New Article&quot; to publish clinical content.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-[#FAF7F2]/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">SEO Health</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const hasSeo = Boolean(item.metaTitle && item.metaDescription);
                  const isTitleOver = (item.metaTitle || '').length > 60;
                  const isDescOver = (item.metaDescription || '').length > 160;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition">
                      {/* Article Title & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image || '/images/photo/doctor-writing.png'}
                            alt=""
                            className="h-12 w-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                            onError={(e) => {
                              e.target.src = '/images/photo/doctor-writing.png';
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                              {item.title}
                            </p>
                            <p className="font-mono text-[11px] text-teal-800 mt-0.5">
                              /blog/{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {item.category || 'Oncology'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            item.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          <span className="capitalize">{item.status || 'published'}</span>
                        </span>
                      </td>

                      {/* SEO Health */}
                      <td className="px-6 py-4">
                        {hasSeo ? (
                          isTitleOver || isDescOver ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              <span>⚠</span> Limits Exceeded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              <span>✓</span> SEO Optimal
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            Auto Defaults
                          </span>
                        )}
                      </td>

                      {/* Read Time */}
                      <td className="px-6 py-4 text-slate-500 text-[11px]">
                        {item.readTime || '5 min read'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`/blog/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:text-teal-800 hover:bg-slate-50 transition"
                            title="Preview on Public Site"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBlog(item);
                              setModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 shadow-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Article"
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

      {/* Editor Modal */}
      <BlogEditorModal
        blog={editingBlog}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveBlog}
      />
    </div>
  );
}
