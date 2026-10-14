import { useState, useEffect } from 'react';

export default function AccountSettingsTab({ onProfileUpdated }) {
  const [profile, setProfile] = useState({
    name: 'Dr. Apoorva',
    username: 'admin',
    email: 'dr.apoorva@oncocure.co.in',
    role: 'Super Administrator',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Load profile on mount
  useEffect(() => {
    let live = true;
    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then((data) => {
        if (!live) return;
        if (data.username) {
          setProfile({
            name: data.name || 'Dr. Apoorva',
            username: data.username || 'admin',
            email: data.email || 'dr.apoorva@oncocure.co.in',
            role: data.role || 'Super Administrator',
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    // Validate password change if attempted
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setStatusMessage({
          type: 'error',
          text: 'Please enter your current password to set a new password.',
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMessage({
          type: 'error',
          text: 'New password and confirmation do not match.',
        });
        return;
      }
      if (newPassword.length < 6) {
        setStatusMessage({
          type: 'error',
          text: 'New password must be at least 6 characters long.',
        });
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: profile.name.trim(),
        username: profile.username.trim(),
        email: profile.email.trim(),
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to update account settings');
      }

      setStatusMessage({
        type: 'success',
        text: 'Account settings updated successfully.',
      });

      // Clear password fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onProfileUpdated && result.user) {
        onProfileUpdated(result.user);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading account settings…</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage administrative login credentials and profile details.
        </p>
      </div>

      {/* Status Banner */}
      {statusMessage.text && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Account Info Summary Card */}
      <div className="flex items-center gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-800 text-base font-bold text-white shadow-xs">
          {(profile.name || 'A').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-base font-bold text-slate-900 leading-tight">
              {profile.name || 'Dr. Apoorva'}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold text-teal-900 border border-teal-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span>{profile.role || 'Super Administrator'}</span>
            </span>
          </div>
          <p className="font-mono text-xs text-teal-800 font-medium mt-0.5">
            @{profile.username || 'admin'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Identity & Profile Details */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Display name and administrative handle.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Dr. Apoorva"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="e.g. admin"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-mono font-semibold text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Administrative Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="e.g. dr.apoorva@oncocure.co.in"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Used for system alerts, password recovery, and lead notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Password & Security */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Change Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Leave these fields blank if you do not want to change your password.
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to verify"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pr-10 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 pr-10 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-8 py-3 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Saving Settings…</span>
              </>
            ) : (
              <span>Save Account Changes →</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
