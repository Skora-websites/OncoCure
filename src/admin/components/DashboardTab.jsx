import { useState, useEffect } from 'react';

export default function DashboardTab({ onSelectTab }) {
  const [stats, setStats] = useState({
    consultationsTotal: 0,
    consultationsNew: 0,
    contactsTotal: 0,
    contactsNew: 0,
    servicesCount: 0,
    blogsCount: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/consultations').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/contacts').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/services').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/blogs').then((r) => r.json()).catch(() => ({ items: [] })),
    ]).then(([cData, mData, sData, bData]) => {
      const cItems = cData.items || [];
      const mItems = mData.items || [];
      const bItems = bData.items || [];
      setStats({
        consultationsTotal: cItems.length,
        consultationsNew: cItems.filter((x) => x.status === 'new').length,
        contactsTotal: mItems.length,
        contactsNew: mItems.filter((x) => x.status === 'new').length,
        servicesCount: (sData.items || []).length,
        blogsCount: bItems.length,
      });
      setRecentConsultations(cItems.slice(0, 5));
      setRecentBlogs(bItems.slice(0, 4));
      setRecentContacts(mItems.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Contacted
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Operational summary and live inquiries across Onco Cure Clinic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('blogs')}
            className="rounded-xl bg-[#175252] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#113e3e] transition"
          >
            + New Blog
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('services')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* Modern Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Consultations */}
        <div
          onClick={() => onSelectTab('consultations')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#e8f5f4] text-[#175252]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Consultation Form
            </h3>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">
              {stats.consultationsTotal}
            </p>
            {stats.consultationsNew > 0 && (
              <span className="inline-block text-[11px] font-semibold text-amber-700 mt-1">
                {stats.consultationsNew} new
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Contact Queries */}
        <div
          onClick={() => onSelectTab('contacts')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#f5eef4] text-[#4A2040]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Contact Messages
            </h3>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">
              {stats.contactsTotal}
            </p>
            {stats.contactsNew > 0 && (
              <span className="inline-block text-[11px] font-semibold text-blue-700 mt-1">
                {stats.contactsNew} new
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Clinical Services */}
        <div
          onClick={() => onSelectTab('services')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#fef3c7] text-[#92400e]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Total Services
            </h3>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">
              {stats.servicesCount}
            </p>
            <span className="inline-block text-[11px] font-medium text-slate-400 mt-1">
              Active lines
            </span>
          </div>
        </div>

        {/* Card 4: Published Blogs */}
        <div
          onClick={() => onSelectTab('blogs')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#eff6ff] text-[#1d4ed8]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Published Blogs
            </h3>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 leading-none">
              {stats.blogsCount}
            </p>
            <span className="inline-block text-[11px] font-medium text-slate-400 mt-1">
              Articles
            </span>
          </div>
        </div>
      </div>

      {/* Main Table: Recent Consultations */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-slate-900">Recent Consultation Requests</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest patient submissions requiring review or follow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('consultations')}
            className="text-xs font-semibold text-[#175252] hover:underline"
          >
            View All ({stats.consultationsTotal}) →
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading requests…</div>
        ) : recentConsultations.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No consultation requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#f7f8fc] border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Concern</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentConsultations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`tel:${item.phone}`} className="font-mono text-teal-800 hover:underline">
                        {item.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.concern || 'General Oncology'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectTab('consultations')}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 shadow-2xs transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Grid: Recent Blogs & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Blogs */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">Recent Blog Posts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Published patient articles.</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('blogs')}
              className="text-xs font-semibold text-[#175252] hover:underline"
            >
              All Blogs →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBlogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No blog posts yet.</div>
            ) : (
              recentBlogs.map((b) => (
                <div key={b.id || b.slug} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={b.image || '/images/photo/doctor-writing.png'}
                      alt=""
                      className="h-10 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        e.target.src = '/images/photo/doctor-writing.png';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{b.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{b.category} • {b.readTime || '5 min'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTab('blogs')}
                    className="shrink-0 text-xs font-semibold text-slate-600 hover:text-teal-800"
                  >
                    Edit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Contact Inquiries */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">Recent Contact Messages</h3>
              <p className="text-xs text-slate-500 mt-0.5">General patient inquiries.</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('contacts')}
              className="text-xs font-semibold text-[#175252] hover:underline"
            >
              All Messages →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No messages yet.</div>
            ) : (
              recentContacts.map((m) => (
                <div key={m.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{m.subject || m.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTab('contacts')}
                    className="shrink-0 text-xs font-semibold text-slate-600 hover:text-teal-800"
                  >
                    Reply
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
