import { useState, useEffect, useRef } from 'react';
import { slugify } from '../slugify.js';
import { processClipboardPaste } from '../richPasteCleaner.js';

export default function BlogEditorModal({ blog, isOpen, onClose, onSave }) {
  const isEditMode = Boolean(blog && blog.id);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Oncology');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('/images/photo/doctor-writing.png');
  const [imageAlt, setImageAlt] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [status, setStatus] = useState('published');

  // Feature 1: SEO Meta Tags
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Feature 2: WordPress-style slug locking tracking
  const isSlugUserModified = useRef(false);
  const [slugLockedState, setSlugLockedState] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'media' | 'seo'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pastingNotice, setPastingNotice] = useState(false);
  const editorRef = useRef(null);

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

    if (blog) {
      setTitle(blog.title || '');
      setSlug(blog.slug || '');
      setCategory(blog.category || 'Oncology');
      setExcerpt(blog.excerpt || '');
      setContent(
        blog.content ||
          (blog.body
            ? blog.body
                .map((s) => `<h3>${s.heading || ''}</h3><p>${(s.paragraphs || []).join(' ')}</p>`)
                .join('')
            : '')
      );
      setImage(blog.image || '/images/photo/doctor-writing.png');
      setImageAlt(blog.imageAlt || '');
      setReadTime(blog.readTime || '5 min read');
      setStatus(blog.status || 'published');

      // Feature 1: Repopulate SEO fields
      setMetaTitle(blog.metaTitle || '');
      setMetaKeywords(blog.metaKeywords || '');
      setMetaDescription(blog.metaDescription || '');
      setCanonicalUrl(blog.canonicalUrl || '');

      // Feature 2: On edit form, a prefilled/saved slug behaves as locked
      isSlugUserModified.current = Boolean(blog.slug);
      setSlugLockedState(Boolean(blog.slug));
    } else {
      // New Blog form
      setTitle('');
      setSlug('');
      setCategory('Oncology');
      setExcerpt('');
      setContent('<p>Write educational oncology content here…</p>');
      setImage('/images/photo/doctor-writing.png');
      setImageAlt('');
      setReadTime('5 min read');
      setStatus('published');

      setMetaTitle('');
      setMetaKeywords('');
      setMetaDescription('');
      setCanonicalUrl('');

      isSlugUserModified.current = false;
      setSlugLockedState(false);
    }
    setActiveTab('content');
  }, [isOpen, blog]);

  // Keep contenteditable in sync
  useEffect(() => {
    if (editorRef.current && isOpen) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [isOpen, content]);

  // Feature 2: Title & Slug Change Logic
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

  // Feature 3: Rich Paste Fidelity Handler
  const handleEditorPaste = async (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const htmlFlavor = clipboardData.getData('text/html');

    if (!htmlFlavor || !htmlFlavor.trim()) {
      return; // allow browser default paste
    }

    e.preventDefault();
    setPastingNotice(true);

    try {
      const result = await processClipboardPaste(clipboardData);
      document.execCommand('insertHTML', false, result.cleanedHtml);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    } catch (err) {
      console.error('Rich paste processing error:', err);
      const text = clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    } finally {
      setTimeout(() => setPastingNotice(false), 2000);
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      } else {
        alert('Image upload failed.');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleSubmit = async (targetStatus = status) => {
    if (!title.trim()) {
      alert('Article title is required.');
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      alert('Article slug is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category,
        excerpt: excerpt.trim(),
        content: editorRef.current ? editorRef.current.innerHTML : content,
        image,
        imageAlt: imageAlt.trim(),
        readTime,
        status: targetStatus,
        metaTitle: metaTitle.trim() || null,
        metaKeywords: metaKeywords.trim() || null,
        metaDescription: metaDescription.trim() || null,
        canonicalUrl: canonicalUrl.trim() || null,
      };

      await onSave(payload, blog ? blog.id : null);
      onClose();
    } catch (err) {
      alert('Save error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // SEO Counters
  const metaTitleCount = metaTitle.length;
  const isMetaTitleOver = metaTitleCount > 60;
  const metaDescCount = metaDescription.length;
  const isMetaDescOver = metaDescCount > 160;
  const canonicalUrlCount = canonicalUrl.length;
  const isCanonicalOver = canonicalUrlCount > 500;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs overscroll-contain overflow-hidden"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex h-[90vh] max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200"
        data-lenis-prevent
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#FAF7F2]/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">
                {isEditMode ? 'Edit Educational Article' : 'Write New Educational Article'}
              </h2>
              <p className="text-xs text-slate-500">
                Oncology knowledge base & patient education system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="published">● Published</option>
              <option value="draft">● Draft</option>
            </select>

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
        <div className="flex border-b border-slate-100 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'content'
                ? 'border-teal-800 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Title & Article Content
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
            2. Featured Media
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
            {(isMetaTitleOver || isMetaDescOver || isCanonicalOver) && (
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
          {/* TAB 1: Content */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Understanding Targeted Therapy in Modern Oncology"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-serif text-lg font-bold text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                />
              </div>

              {/* Slug with WordPress Lock Toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    URL Slug
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
                  <span className="font-mono text-slate-400">oncocure.co.in/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={handleSlugInputChange}
                    placeholder="article-slug"
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
                <p className="mt-1 text-[11px] text-slate-400">
                  {slugLockedState
                    ? 'Manually edited. Clear the field or click unlock to resume auto-generating from the title.'
                    : 'Auto-fills as you type the title.'}
                </p>
              </div>

              {/* Category, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Clinical Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 focus:border-teal-700 focus:outline-none"
                  >
                    <option value="Oncology">Oncology</option>
                    <option value="Understanding Cancer">Understanding Cancer</option>
                    <option value="Treatment & Therapies">Treatment & Therapies</option>
                    <option value="Pain & Symptom Care">Pain & Symptom Care</option>
                    <option value="Prevention & Screening">Prevention & Screening</option>
                    <option value="Living Well">Living Well</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise clinical overview displayed on article cards…"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>

              {/* Content Editor with Formatting Toolbar */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Article Body (Rich Paste Enabled)
                  </label>
                  {pastingNotice && (
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 animate-pulse">
                      ✨ Cleaning pasted formatting & images…
                    </span>
                  )}
                </div>

                {/* Editor Toolbar */}
                <div className="mt-2 flex flex-wrap items-center gap-1 rounded-t-2xl border border-slate-200 bg-[#FAF7F2] p-2">
                  <button
                    type="button"
                    onClick={() => execCmd('bold')}
                    className="rounded-lg p-1.5 text-xs font-bold text-slate-700 hover:bg-white shadow-xs"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('italic')}
                    className="rounded-lg p-1.5 text-xs italic font-serif text-slate-700 hover:bg-white shadow-xs"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('underline')}
                    className="rounded-lg p-1.5 text-xs underline text-slate-700 hover:bg-white shadow-xs"
                    title="Underline"
                  >
                    U
                  </button>
                  <span className="h-4 w-px bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<h2>')}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-slate-700 hover:bg-white shadow-xs"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<h3>')}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-slate-700 hover:bg-white shadow-xs"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<p>')}
                    className="rounded-lg px-2 py-1 text-xs text-slate-700 hover:bg-white shadow-xs"
                    title="Paragraph"
                  >
                    Paragraph
                  </button>
                  <span className="h-4 w-px bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={() => execCmd('insertUnorderedList')}
                    className="rounded-lg px-2 py-1 text-xs text-slate-700 hover:bg-white shadow-xs"
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('insertOrderedList')}
                    className="rounded-lg px-2 py-1 text-xs text-slate-700 hover:bg-white shadow-xs"
                    title="Numbered List"
                  >
                    1. List
                  </button>
                  <button
                    type="button"
                    onClick={() => execCmd('formatBlock', '<blockquote>')}
                    className="rounded-lg px-2 py-1 text-xs text-slate-700 hover:bg-white shadow-xs"
                    title="Quote"
                  >
                    &ldquo; Quote
                  </button>
                  <span className="h-4 w-px bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={() => execCmd('removeFormat')}
                    className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white shadow-xs"
                    title="Clear Formatting"
                  >
                    Clear Format
                  </button>
                </div>

                {/* Contenteditable Writing Surface */}
                <div
                  ref={editorRef}
                  contentEditable
                  onPaste={handleEditorPaste}
                  onInput={() => {
                    if (editorRef.current) setContent(editorRef.current.innerHTML);
                  }}
                  className="min-h-[280px] rounded-b-2xl border-x border-b border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700/10 prose prose-slate max-w-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Featured Media */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Featured Header Image
                </label>
                <div className="mt-3 flex items-start gap-5">
                  <div className="relative h-36 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm shrink-0">
                    <img
                      src={image}
                      alt={imageAlt || 'Featured article preview'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/photo/doctor-writing.png';
                      }}
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                        Uploading…
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 text-xs">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Upload New Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-teal-800 hover:file:bg-teal-100"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Or Direct Image URL / Path</label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/images/photo/..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Image Alt Text (Accessibility & Image SEO)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Dr. Sahil explaining chemotherapy protocol to patient"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SEO Settings (Feature 1) */}
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
                    <span className="text-slate-400">› blog › {slug || 'article-url'}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1a0dab] hover:underline line-clamp-1 cursor-pointer">
                    {metaTitle || title || 'Article Title - Onco Cure Clinic Greater Noida'}
                  </h3>
                  <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {metaDescription ||
                      excerpt ||
                      'Comprehensive cancer care insights and medical oncology articles by Dr. Sahil Bambroo at Onco Cure Clinic.'}
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
                  placeholder="Target 60 chars (defaults to article title if empty)"
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
                  placeholder="Target 160 chars (defaults to clean excerpt if empty)"
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
                  placeholder="e.g. oncology, targeted therapy, cancer care Greater Noida, chemotherapy"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-teal-700 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Separate relevant medical index keywords with commas.
                </p>
              </div>

              {/* Canonical URL (strong override; main URL auto-used when empty) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Canonical URL (optional, absolute)
                  </label>
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isCanonicalOver ? 'text-red-600 animate-pulse' : 'text-slate-500'
                    }`}
                  >
                    {canonicalUrlCount} / 500 characters
                  </span>
                </div>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="e.g. https://oncocure.co.in/blog/understanding-targeted-therapy"
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-800 focus:outline-none transition ${
                    isCanonicalOver
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-slate-200 focus:border-teal-700'
                  }`}
                />
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCanonicalOver ? 'bg-red-500' : 'bg-teal-700'
                    }`}
                    style={{ width: `${Math.min(100, (canonicalUrlCount / 500) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Preferred URL to index. Leave empty to keep the article's main URL under /blog/{'<'}slug{'>'}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-[#FAF7F2]/80 px-6 py-4">
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
              onClick={() => handleSubmit('draft')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('published')}
              className="rounded-xl bg-gradient-to-r from-teal-800 to-[#1b5e5a] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-teal-900 hover:to-teal-800 disabled:opacity-60 transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving Article…</span>
                </>
              ) : (
                <span>Publish Article →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
