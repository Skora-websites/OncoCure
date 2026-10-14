import { useState, useEffect } from 'react';

export default function SiteDetailsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [details, setDetails] = useState({
    name: 'Onco Cure Clinic',
    tagline: 'Patient-centred cancer care clinic in Greater Noida',
    phone: '',
    phoneSecondary: '',
    whatsapp: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201310',
      mapUrl: '',
    },
    hours: [],
    socials: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
    },
    metaDefaults: {
      title: '',
      description: '',
      keywords: '',
    },
  });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/site-details');
      if (res.ok) {
        const data = await res.json();
        if (data) setDetails((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (path, val) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      setDetails((prev) => ({ ...prev, [keys[0]]: val }));
    } else if (keys.length === 2) {
      setDetails((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: val },
      }));
    }
  };

  const handleHourChange = (index, field, val) => {
    const updated = [...details.hours];
    updated[index] = { ...updated[index], [field]: val };
    setDetails((prev) => ({ ...prev, hours: updated }));
  };

  const addHourSlot = () => {
    setDetails((prev) => ({
      ...prev,
      hours: [
        ...prev.hours,
        {
          id: `slot-${Date.now()}`,
          label: 'Speciality Oncology Session',
          days: 'Monday to Saturday',
          time: '9:00 am – 8:00 pm',
        },
      ],
    }));
  };

  const removeHourSlot = (index) => {
    setDetails((prev) => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/site-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('clinic-updated', { detail: details }));
        setToast('Site details saved successfully!');
        setTimeout(() => setToast(''), 4000);
      }
    } catch (err) {
      alert('Failed to save site details: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading site details…</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in">
      {/* Header with Save CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            Site Details & Practice Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Clinic helplines, OPD schedule, Greater Noida address, and social channels.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition"
        >
          {saving ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Saving Changes…</span>
            </>
          ) : (
            <span>Save All Changes</span>
          )}
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in shadow-xs">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Section 1: Clinic Identity & Contact Numbers */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Clinic Identity & Phone Lines
          </h2>
          <p className="text-xs text-slate-500">
            These contact points appear across the public navbar, footer and emergency banners.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Practice Name
            </label>
            <input
              type="text"
              value={details.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Clinical Tagline
            </label>
            <input
              type="text"
              value={details.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Primary Clinic Phone (OPD Booking)
            </label>
            <input
              type="text"
              value={details.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 99992 04618"
              className="mt-1.5 w-full rounded-xl border border-slate-200 font-mono p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Secondary / Emergency Line
            </label>
            <input
              type="text"
              value={details.phoneSecondary}
              onChange={(e) => handleChange('phoneSecondary', e.target.value)}
              placeholder="+91 99992 04619"
              className="mt-1.5 w-full rounded-xl border border-slate-200 font-mono p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              WhatsApp Business Number
            </label>
            <input
              type="text"
              value={details.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+91 99992 04618"
              className="mt-1.5 w-full rounded-xl border border-slate-200 font-mono p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Official Email Address
            </label>
            <input
              type="email"
              value={details.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="care@oncocure.co.in"
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Physical Address & Map */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Clinic Address & Navigation
          </h2>
          <p className="text-xs text-slate-500">
            Physical location displayed in the footer and appointment directions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Address Line 1 (Suite / Commercial Plaza)
            </label>
            <input
              type="text"
              value={details.address?.line1 || ''}
              onChange={(e) => handleChange('address.line1', e.target.value)}
              placeholder="Shop / Unit No., Commercial Complex"
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Address Line 2 (Sector / Landmark)
            </label>
            <input
              type="text"
              value={details.address?.line2 || ''}
              onChange={(e) => handleChange('address.line2', e.target.value)}
              placeholder="Sector Delta 1, Near Metro Station"
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              value={details.address?.city || ''}
              onChange={(e) => handleChange('address.city', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              State & PIN Code
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={details.address?.state || ''}
                onChange={(e) => handleChange('address.state', e.target.value)}
                placeholder="Uttar Pradesh"
                className="w-2/3 rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
              />
              <input
                type="text"
                value={details.address?.pincode || ''}
                onChange={(e) => handleChange('address.pincode', e.target.value)}
                placeholder="201310"
                className="w-1/3 rounded-xl border border-slate-200 font-mono p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Google Maps URL / Embed Link
            </label>
            <input
              type="text"
              value={details.address?.mapUrl || ''}
              onChange={(e) => handleChange('address.mapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Working & OPD Hours */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Working & OPD Consultation Hours
            </h2>
            <p className="text-xs text-slate-500">
              Operating slots displayed on the home page, contact page and booking dialog.
            </p>
          </div>
          <button
            type="button"
            onClick={addHourSlot}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            + Add Timing Slot
          </button>
        </div>

        <div className="space-y-3">
          {(details.hours || []).map((slot, idx) => (
            <div
              key={slot.id || idx}
              className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200/80 bg-[#FAF7F2]/60 p-4 text-xs"
            >
              <div className="w-full sm:w-1/3">
                <label className="block text-[10px] font-bold uppercase text-slate-500">
                  Slot Label
                </label>
                <input
                  type="text"
                  value={slot.label || ''}
                  onChange={(e) => handleHourChange(idx, 'label', e.target.value)}
                  placeholder="e.g. Oncology OPD"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-[10px] font-bold uppercase text-slate-500">
                  Operating Days
                </label>
                <input
                  type="text"
                  value={slot.days || ''}
                  onChange={(e) => handleHourChange(idx, 'days', e.target.value)}
                  placeholder="Monday to Saturday"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-[10px] font-bold uppercase text-slate-500">
                  Timings
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={slot.time || ''}
                    onChange={(e) => handleHourChange(idx, 'time', e.target.value)}
                    placeholder="9:00 am – 8:00 pm"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeHourSlot(idx)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Remove Slot"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Social Channels */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Social Media Channels
          </h2>
          <p className="text-xs text-slate-500">
            Direct public profiles for patient education and community engagement.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Facebook URL
            </label>
            <input
              type="text"
              value={details.socials?.facebook || ''}
              onChange={(e) => handleChange('socials.facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={details.socials?.instagram || ''}
              onChange={(e) => handleChange('socials.instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={details.socials?.linkedin || ''}
              onChange={(e) => handleChange('socials.linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider">
              YouTube Channel URL
            </label>
            <input
              type="text"
              value={details.socials?.youtube || ''}
              onChange={(e) => handleChange('socials.youtube', e.target.value)}
              placeholder="https://youtube.com/@..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <span className="text-xs font-semibold text-slate-600">
          Unsaved changes will be updated live across the website.
        </span>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-7 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition"
        >
          {saving ? 'Saving…' : 'Save Site Details'}
        </button>
      </div>
    </form>
  );
}
