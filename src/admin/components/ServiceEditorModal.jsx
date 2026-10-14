import { useState, useEffect, useRef } from 'react';
import { slugify } from '../slugify.js';

export default function ServiceEditorModal({ service, isOpen, onClose, onSave }) {
  const isEditMode = Boolean(service && service.id);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [group, setGroup] = useState('Medical Oncology');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [covers, setCovers] = useState([]);
  const [newCover, setNewCover] = useState('');
  const [tags, setTags] = useState('');
  const [accent, setAccent] = useState('plum');
  const [image, setImage] = useState('/images/photo/consult-care.jpg');

  // SEO Meta Tags
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // WordPress-style slug locking tracking
  const isSlugUserModified = useRef(false);
  const [slugLockedState, setSlugLockedState] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'media' | 'seo'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Lock background scrolling (native + Lenis) while modal is open
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('scroll-lock'));
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.dispatchEvent(new Event('scroll-unlock'));
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Populate on open / reopen
  useEffect(() => {
    if (!isOpen) return;

    if (service) {
      setTitle(service.title || '');
      setSlug(service.slug || '');
      setGroup(service.group || 'Medical Oncology');
      setSummary(service.summary || '');
      setDescription(service.description || (Array.isArray(service.overview) ? service.overview.join('\n\n') : ''));
      setCovers(Array.isArray(service.covers) ? [...service.covers] : []);
      setTags(Array.isArray(service.tags) ? service.tags.join(', ') : '');
      setAccent(service.accent || 'plum');
      setImage(service.image || '/images/photo/consult-care.jpg');

      // Repopulate SEO fields
      setMetaTitle(service.metaTitle || '');
      setMetaKeywords(service.metaKeywords || '');
      setMetaDescription(service.metaDescription || '');

      // On edit form, a prefilled/saved slug behaves as locked
      isSlugUserModified.current = Boolean(service.slug);
      setSlugLockedState(Boolean(service.slug));
    } else {
      // New Service form
      setTitle('');
      setSlug('');
      setGroup('Medical Oncology');
      setSummary('');
      setDescription('');
      setCovers([]);
      setTags('');
      setAccent('plum');
      setImage('/images/photo/consult-care.jpg');

      setMetaTitle('');
      setMetaKeywords('');
      setMetaDescription('');

      isSlugUserModified.current = false;
      setSlugLockedState(false);
    }
    setActiveTab('details');
  }, [isOpen, service]);

  // Title & Slug Auto-Sync Logic
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (!isSlugUserModified.current || slug.trim() === '') {
      const generated = slugify(newTitle);
      setSlug(generated);
    }
  };

  const handleSlugInputChange = (e) => {
    const val = e.target.value;
    setSlug(val);

    if (val.trim() === '') {
      isSlugUserModified.current = false;
      setSlugLockedState(false);
    } else {
      isSlugUserModified.current = true;
      setSlugLockedState(true);
    }
  };

  const handleToggleSlugLock = () => {
    if (slugLockedState) {
      // Unlock: regenerate from current title
      isSlugUserModified.current = false;
      setSlugLockedState(false);
      setSlug(slugify(title));
    } else {
      // Lock manually
      isSlugUserModified.current = true;
      setSlugLockedState(true);
    }
  };

  // Covers / Sub-procedures handlers
  const handleAddCover = (e) => {
    if (e) e.preventDefault();
    if (!newCover.trim()) return;
    setCovers([...covers, newCover.trim()]);
    setNewCover('');
  };

  const handleRemoveCover = (index) => {
    setCovers(covers.filter((_, i) => i !== index));
  };

  // Direct Image Upload via /api/upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      alert('Title and Slug are required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      group,
      summary: summary.trim(),
      description: description.trim(),
      overview: description.trim() ? description.trim().split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [],
      covers,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      accent,
      image,
      // Persist SEO Meta Tags
      metaTitle: metaTitle.trim().slice(0, 255) || null,
      metaKeywords: metaKeywords.trim().slice(0, 500) || null,
      metaDescription: metaDescription.trim().slice(0, 500) || null,
    };

    try {
      await onSave(payload, service?.id);
      onClose();
    } catch (err) {
      alert('Error saving service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // SEO Character Counters
  const metaTitleCount = metaTitle.length;
  const isMetaTitleOver = metaTitleCount > 60;
  const metaDescCount = metaDescription.length;
  const isMetaDescOver = metaDescCount > 160;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs overscroll-contain overflow-hidden"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex h-[90vh] max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200"
        data-lenis-prevent
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#FAF7F2]/80 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                {isEditMode ? 'Edit Clinical Service' : 'Add New Oncology Service'}
              </h2>
              <p className="text-xs text-slate-500">
                Specialist treatment lines, clinical scope, and search engine optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-slate-100 bg-white px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'details'
                ? 'border-teal-800 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Details & Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'media'
                ? 'border-teal-800 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Covers & Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'seo'
                ? 'border-teal-800 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>3. SEO Settings</span>
            {(isMetaTitleOver || isMetaDescOver) && (
              <span className="h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain"
          data-lenis-prevent
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {/* TAB 1: Details & Description */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Systemic Chemotherapy & Daycare Protocols"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-serif text-lg font-bold text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                />
              </div>

              {/* URL Slug with WordPress Lock Toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSlugLock}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:underline"
                  >
                    {slugLockedState ? '🔒 Locked (Click to Sync with Title)' : '🔗 Auto-syncing with Title'}
                  </button>
                </div>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs">
                  <span className="font-mono text-slate-400">oncocure.co.in/services/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={handleSlugInputChange}
                    placeholder="service-slug"
                    className="flex-1 bg-transparent font-mono font-semibold text-slate-900 focus:outline-none pl-1"
                  />
                  <button
                    type="button"
                    onClick={handleToggleSlugLock}
                    className="ml-2 text-slate-400 hover:text-slate-700"
                    title={slugLockedState ? 'Slug is locked' : 'Slug follows title'}
                  >
                    {slugLockedState ? '🔒' : '🔓'}
                  </button>
                </div>
              </div>

              {/* Group & Accent */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Clinical Group
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  >
                    <option value="Medical Oncology">Medical Oncology</option>
                    <option value="Supportive & Pain Oncology">Supportive & Pain Oncology</option>
                    <option value="Diagnostics & Second Opinions">Diagnostics & Second Opinions</option>
                    <option value="Systemic Therapies">Systemic Therapies</option>
                    <option value="Palliative & Integrative Care">Palliative & Integrative Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Accent Color
                  </label>
                  <select
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  >
                    <option value="plum">Plum Ribbon (#4A2040)</option>
                    <option value="teal">Deep Teal (#175252)</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Summary / Executive Overview
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Concise 1–2 sentence overview of what this service delivers…"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Service Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Complete clinical explanation of the patient journey, protocols, and medical approach…"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Covers & Media */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              {/* Featured Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Featured Service Image
                </label>
                <div className="mt-2 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative h-32 w-48 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                    <img
                      src={image}
                      alt={title || 'Service preview'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/photo/consult-care.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Image URL e.g. /images/photo/consult-care.jpg"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition">
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{uploadingImage ? 'Uploading…' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setImage('/images/photo/consult-care.jpg')}
                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-procedures (Covers list) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  What It Covers (Sub-procedures & Treatments)
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Specific treatments and modalities highlighted on the service page.
                </p>

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCover();
                      }
                    }}
                    placeholder="e.g. Second opinions & histology review"
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCover}
                    className="rounded-xl bg-[#175252] px-4 py-2 text-xs font-semibold text-white hover:bg-[#113e3e] transition"
                  >
                    + Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {covers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No sub-procedures added yet.</p>
                  ) : (
                    covers.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50/80 px-2.5 py-1 text-xs font-medium text-teal-900"
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCover(i)}
                          className="text-teal-600 hover:text-teal-900 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tags & Focus Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Medical Oncology, Daycare, Chemotherapy, Targeted Therapy"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SEO Settings (Feature Parity with Blog) */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-fade-in">
              {/* Google SERP Live Snippet Preview */}
              <div className="rounded-2xl border border-slate-200/80 bg-[#FAF7F2]/60 p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Google Search Snippet Preview
                </span>
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-xs max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800 text-[9px] font-bold text-white">
                      OC
                    </span>
                    <span className="text-slate-800">oncocure.co.in</span>
                    <span className="text-slate-400">› services › {slug || 'service-url'}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1a0dab] hover:underline line-clamp-1 cursor-pointer">
                    {metaTitle || (title ? `${title} — Onco Cure Clinic` : 'Service Title — Onco Cure Clinic Greater Noida')}
                  </h3>
                  <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {metaDescription ||
                      summary ||
                      'Specialist oncology care, systemic treatment planning and supportive symptom management at Onco Cure Clinic Greater Noida.'}
                  </p>
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meta Title (Browser Tab & SERP)
                  </label>
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isMetaTitleOver ? 'text-red-600 animate-pulse' : 'text-slate-500'
                    }`}
                  >
                    {metaTitleCount} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Target 60 chars (defaults to service title if empty)"
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-800 focus:outline-none transition ${
                    isMetaTitleOver
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-200 focus:border-teal-700'
                  }`}
                />
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMetaTitleOver ? 'bg-red-500' : 'bg-teal-700'
                    }`}
                    style={{ width: `${Math.min(100, (metaTitleCount / 60) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Optimal length for search engines is 50–60 characters.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meta Description
                  </label>
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isMetaDescOver ? 'text-red-600 animate-pulse' : 'text-slate-500'
                    }`}
                  >
                    {metaDescCount} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Target 160 chars (defaults to service summary if empty)"
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-800 focus:outline-none transition ${
                    isMetaDescOver
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-200 focus:border-teal-700'
                  }`}
                />
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMetaDescOver ? 'bg-red-500' : 'bg-teal-700'
                    }`}
                    style={{ width: `${Math.min(100, (metaDescCount / 160) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Search engines usually truncate snippets after ~160 characters.
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Meta Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="e.g. oncology service, chemotherapy Greater Noida, daycare infusion, pain oncology"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Separate relevant medical index keywords with commas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-[#FAF7F2]/80 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving Service…</span>
                </>
              ) : (
                <span>Save Service →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
