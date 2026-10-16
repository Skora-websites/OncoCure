import { useState } from 'react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.token) {
          localStorage.setItem('oncocure_admin_token', data.token);
        }
        localStorage.setItem('oncocure_admin_auth', 'true');
        onLoginSuccess();
        return;
      }

      if (res.status === 404 || res.status === 502 || res.status === 503) {
        setError(`Backend API server unreachable (${res.status} on /api/admin/login). Please ensure the Node.js service is running and reverse-proxied.`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid administrator credentials. Please check your username and password.');
    } catch {
      setError('Unable to reach the server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FAF7F2] font-sans text-slate-800 antialiased selection:bg-teal-700 selection:text-white">
      {/* Left Brand Panel (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#2D1227] via-[#431B3A] to-[#123E3C] p-12 text-white">
        {/* Subtle decorative mesh glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#822d64]/30 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/15">
            <img
              src="/images/brand/logo.png"
              alt="Onco Cure Clinic"
              className="h-9 w-auto brightness-0 invert"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-200">
              Administrative Portal
            </span>
          </div>
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-block rounded-full border border-teal-300/30 bg-teal-900/40 px-3.5 py-1 text-[11px] font-mono tracking-wider uppercase text-teal-200 backdrop-blur-sm">
            Clinical Governance - Evidence-Based Oncology
          </div>
          <h1 className="font-serif text-3xl xl:text-4xl leading-tight font-medium tracking-tight text-white">
            Clinical operations, inquiries & educational oncology in one refined system.
          </h1>
          <p className="text-sm leading-relaxed text-slate-200/90 font-light">
            Empowering Onco Cure's clinical team to seamlessly manage patient consultation requests,
            coordinate patient follow-ups, and author high-impact educational articles.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 backdrop-blur-sm">
              <span className="block font-semibold text-white">Dr. Sahil Bambroo</span>
              <span className="text-slate-300 text-[11px]">DM Medical Oncology</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3.5 border border-white/10 backdrop-blur-sm">
              <span className="block font-semibold text-white">Delta 1, Greater Noida</span>
              <span className="text-slate-300 text-[11px]">OPD & Daycare Center</span>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 text-[11px] text-slate-400">
          <p>&copy; {new Date().getFullYear()} Onco Cure Clinic. All rights reserved.</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Header */}
          <div className="space-y-3 lg:hidden text-center">
            <img
              src="/images/brand/logo.png"
              alt="Onco Cure Clinic"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="font-serif text-2xl font-bold text-slate-900">Admin Control Portal</h2>
          </div>

          <div className="rounded-3xl border border-[#E8DEC8]/80 bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(20,74,71,0.06)]">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                Secure Clinic Access
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500">
                Sign in with your administrative credentials to access patient inquiries and clinic controls.
              </p>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
                <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Username
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-medium text-teal-800 hover:text-teal-900 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-1.5 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-10 pr-10 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] py-3.5 px-4 text-center text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-all hover:from-teal-900 hover:to-teal-800 hover:shadow-lg disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In to Dashboard ->'
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-5 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline"
              >
                &larr; Return to Public Clinic Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
