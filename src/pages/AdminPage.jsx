import { useState, useEffect } from 'react';
import AdminLogin from '../admin/components/AdminLogin.jsx';
import DashboardTab from '../admin/components/DashboardTab.jsx';
import ConsultationsTab from '../admin/components/ConsultationsTab.jsx';
import ContactsTab from '../admin/components/ContactsTab.jsx';
import SiteDetailsTab from '../admin/components/SiteDetailsTab.jsx';
import ServicesTab from '../admin/components/ServicesTab.jsx';
import BlogsTab from '../admin/components/BlogsTab.jsx';
import SeoTab from '../admin/components/SeoTab.jsx';
import AccountSettingsTab from '../admin/components/AccountSettingsTab.jsx';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('oncocure_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({ consultationsNew: 0, contactsNew: 0 });

  const [adminUser, setAdminUser] = useState({
    name: 'Dr. Apoorva',
    username: 'admin',
    image: '/images/photo/drapoorva.jpeg',
    role: 'Admin',
  });

  // Transparently attach Bearer token and credentials to all admin API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input && input.url) || '';
      if (typeof url === 'string' && url.includes('/api/')) {
        const token = localStorage.getItem('oncocure_admin_token');
        const headers = new Headers(init.headers || {});
        if (token && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        init = { ...init, headers, credentials: init.credentials || 'include' };
      }
      const response = await originalFetch(input, init);
      if (response.status === 401 && typeof url === 'string' && !url.includes('/api/admin/login')) {
        localStorage.removeItem('oncocure_admin_auth');
        localStorage.removeItem('oncocure_admin_token');
        setIsAuthenticated(false);
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Fetch admin profile and verify session
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/admin/profile')
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('oncocure_admin_auth');
          localStorage.removeItem('oncocure_admin_token');
          setIsAuthenticated(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.name) {
          setAdminUser({
            name: data.name,
            username: data.username || 'admin',
            image: data.image || '/images/photo/drapoorva.jpeg',
            role: data.role || 'Admin',
          });
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Sync tab with URL e.g. /admin/blogs, /admin/consultations
  useEffect(() => {
    const parseTab = () => {
      const pathSegments = window.location.pathname.replace(/^\//, '').split('/');
      if (pathSegments[0] === 'admin' && pathSegments[1]) {
        setActiveTab(pathSegments[1]);
        return;
      }
      const hash = window.location.hash.replace(/^#\/?/, '');
      const hashParts = hash.split('/');
      if (hashParts[0] === 'admin' && hashParts[1]) {
        setActiveTab(hashParts[1]);
      }
    };
    parseTab();
    window.addEventListener('popstate', parseTab);
    window.addEventListener('hashchange', parseTab);
    return () => {
      window.removeEventListener('popstate', parseTab);
      window.removeEventListener('hashchange', parseTab);
    };
  }, []);

  // Fetch pending badge counts
  useEffect(() => {
    if (!isAuthenticated) return;
    const loadCounts = async () => {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch('/api/consultations').then((r) => r.json()).catch(() => ({ items: [] })),
          fetch('/api/contacts').then((r) => r.json()).catch(() => ({ items: [] })),
        ]);
        const cItems = cRes.items || [];
        const mItems = mRes.items || [];
        setCounts({
          consultationsNew: cItems.filter((x) => x.status === 'new').length,
          contactsNew: mItems.filter((x) => x.status === 'new').length,
        });
      } catch (e) {
        // quiet error
      }
    };
    loadCounts();
  }, [isAuthenticated, activeTab]);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.history.pushState(null, '', `/admin/${tab}`);
  };

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('oncocure_admin_auth');
    localStorage.removeItem('oncocure_admin_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const navSections = [
    {
      heading: 'MAIN',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
        },
      ],
    },
    {
      heading: 'PATIENT INQUIRIES',
      items: [
        {
          id: 'consultations',
          label: 'Consultation Form',
          badge: counts.consultationsNew,
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          id: 'contacts',
          label: 'Contact Messages',
          badge: counts.contactsNew,
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      heading: 'WEBSITE CONTENT',
      items: [
        {
          id: 'services',
          label: 'Services',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
        },
        {
          id: 'blogs',
          label: 'Blogs',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
      ],
    },
    {
      heading: 'SETTINGS',
      items: [
        {
          id: 'site-details',
          label: 'Site Details',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          id: 'seo',
          label: 'SEO',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          ),
        },
        {
          id: 'account',
          label: 'Account Settings',
          icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sans text-slate-800 antialiased selection:bg-teal-700 selection:text-white flex flex-col">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex lg:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            aria-label="Toggle Navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img
            src="/images/brand/logo.png"
            alt="Onco Cure Clinic"
            className="h-8 w-auto"
          />
        </div>
        <a
          href="/"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          View Site ↗
        </a>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[262px] border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/brand/logo.png"
                alt="Onco Cure"
                className="h-9 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <p className="text-xs font-bold text-slate-900 tracking-tight">Onco Cure Admin</p>
                <p className="text-[10px] text-teal-800 font-semibold uppercase tracking-wider">Control Panel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden rounded-lg p-1 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navSections.map((sec) => (
              <div key={sec.heading} className="space-y-1">
                <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {sec.heading}
                </p>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#175252]/10 text-[#175252] font-semibold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-[#175252]' : 'text-slate-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {Boolean(item.badge && item.badge > 0) && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#175252] text-white'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <span>View Live Site</span>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => handleSelectTab('account')}
              className="flex items-center gap-2 text-left hover:opacity-85 transition group"
              title="Account Settings"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white shadow-xs ring-1 ring-teal-700/20">
                {adminUser.name ? adminUser.name.charAt(0) : 'A'}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition">
                  {adminUser.name}
                </p>
                <p className="text-[10px] text-slate-400">Settings &amp; Access</p>
              </div>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-[262px] flex-1 p-6 sm:p-8 lg:p-10 min-w-0">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardTab onSelectTab={handleSelectTab} />}
          {activeTab === 'consultations' && <ConsultationsTab />}
          {activeTab === 'contacts' && <ContactsTab />}
          {activeTab === 'site-details' && <SiteDetailsTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'blogs' && <BlogsTab />}
          {activeTab === 'seo' && <SeoTab />}
          {activeTab === 'account' && <AccountSettingsTab onProfileUpdated={setAdminUser} />}
        </div>
      </main>
    </div>
  );
}
