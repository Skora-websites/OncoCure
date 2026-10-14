import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

import { sanitizeHtml, escapeHtml, generatePlainTextExcerpt } from './sanitizer.js';
import Blog from './models/Blog.js';
import Service from './models/Service.js';
import Consultation from './models/Consultation.js';
import Contact from './models/Contact.js';
import SiteDetails from './models/SiteDetails.js';
import PageSeo from './models/PageSeo.js';
import AdminAccount from './models/AdminAccount.js';

// Default Admin Account: Dr. Apoorva
export const initialAdminAccount = {
  username: 'admin',
  password: 'admin123',
  name: 'Dr. Apoorva',
  email: 'dr.apoorva@oncocure.co.in',
  image: '/images/photo/drapoorva.jpeg',
  role: 'Super Administrator',
};

// Static Page SEO Defaults (seeding all top-level routes)
export const initialPageSeos = [
  {
    id: 'page-home',
    path: '/',
    label: 'Home',
    metaTitle: 'Onco Cure Clinic — Specialist Cancer Care in Greater Noida',
    metaKeywords: 'oncologist greater noida, cancer doctor noida, medical oncology, chemotherapy, cancer clinic',
    metaDescription: 'Onco Cure Clinic is a specialist oncology and pain clinic in Greater Noida, offering medical oncology and anesthesia-led pain care with a patient-first approach.',
    canonicalUrl: '',
  },
  {
    id: 'page-about',
    path: '/about',
    label: 'About Clinic',
    metaTitle: 'About Onco Cure Clinic — Cancer Care & Clinical Philosophy',
    metaKeywords: 'about onco cure, dr sahil bambroo, oncology team greater noida, cancer specialist background',
    metaDescription: 'Learn about Onco Cure Clinic in Greater Noida, founded by Dr. Sahil Bambroo to provide compassionate, scientifically grounded oncology and supportive care.',
    canonicalUrl: '',
  },
  {
    id: 'page-services',
    path: '/services',
    label: 'Services',
    metaTitle: 'Oncology Clinical Services — Onco Cure Clinic',
    metaKeywords: 'chemotherapy, immunotherapy, targeted therapy, cancer second opinions, oncology daycare',
    metaDescription: 'The complete scope of specialist cancer care at Onco Cure Clinic, Greater Noida — consultation, second opinions, systemic therapies, and pain management.',
    canonicalUrl: '',
  },
  {
    id: 'page-blogs',
    path: '/blogs',
    label: 'Articles & Blogs',
    metaTitle: 'Cancer Education & Insights — Onco Cure Clinic',
    metaKeywords: 'cancer articles, oncology advice, patient education, chemotherapy guide, cancer care blog',
    metaDescription: 'Educational guides and specialist clinical insights on cancer symptoms, immunotherapy, targeted treatments, and recovery by Dr. Sahil Bambroo.',
    canonicalUrl: '',
  },
  {
    id: 'page-contact',
    path: '/contact',
    label: 'Contact & Appointments',
    metaTitle: 'Contact Onco Cure Clinic — Book an Oncology Consultation',
    metaKeywords: 'contact onco cure clinic, appointment cancer doctor greater noida, clinic address, hospital directions',
    metaDescription: 'Get in touch with Onco Cure Clinic in Greater Noida. Schedule a first consultation or second opinion with medical oncologist Dr. Sahil Bambroo.',
    canonicalUrl: '',
  },
];

// Legacy seed data
import { blogs as initialBlogs } from '../src/data/blogs.js';
import { servicesFull as initialServices } from '../src/data/services.js';
import { clinic as initialClinic } from '../src/data/clinic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'images', 'uploads');
const STORE_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(STORE_DIR, 'store.json');

// Ensure upload & store directories exist if filesystem is writable
try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
} catch {
  // Read-only filesystem in serverless environments (e.g. Vercel)
}

const app = express();
const PORT = process.env.PORT || 5055;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oncocure';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure DB is connected in serverless environments before handling requests
app.use(async (_req, _res, next) => {
  if (process.env.MONGODB_URI && !isMongoConnected) {
    await initMongo().catch(() => {});
  }
  next();
});

// -----------------------------------------------------------------------------
// Storage Adapter: MongoDB with automatic file-backed JSON store fallback
// -----------------------------------------------------------------------------
let isMongoConnected = false;

// In-memory / file-backed fallback store
let localStore = {
  blogs: [],
  services: [],
  consultations: [],
  contacts: [],
  siteDetails: null,
  pageSeo: [],
  adminAccount: null,
};

function loadLocalStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      localStore = JSON.parse(raw);
      if (!Array.isArray(localStore.pageSeo) || localStore.pageSeo.length === 0) {
        localStore.pageSeo = [...initialPageSeos];
        saveLocalStore();
      }
      if (!localStore.adminAccount) {
        localStore.adminAccount = { ...initialAdminAccount };
        saveLocalStore();
      }
    } else {
      seedInitialLocalStore();
    }
  } catch {
    seedInitialLocalStore();
  }
}

function saveLocalStore() {
  try {
    const tempFile = `${STORE_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(localStore, null, 2), 'utf-8');
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
    console.warn('Notice: Local store write skipped (ephemeral/read-only filesystem).');
  }
}

function seedInitialLocalStore() {
  localStore.blogs = initialBlogs.map((b) => ({
    id: b.id || b.slug,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.body
      ? b.body
          .map((s) => `<h3>${s.heading || ''}</h3><p>${s.text || ''}</p>`)
          .join('')
      : '',
    body: b.body || [],
    category: b.category || 'Oncology',
    image: b.image || '/images/photo/doctor-writing.png',
    imageAlt: b.imageAlt || '',
    date: b.date || '2026-10-01',
    readTime: b.readTime || '5 min read',
    status: 'published',
    metaTitle: null,
    metaKeywords: null,
    metaDescription: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  localStore.services = initialServices.map((s, idx) => ({
    id: s.id || s.slug,
    slug: s.slug,
    title: s.title,
    group: s.group,
    summary: s.summary,
    description: s.description || s.summary,
    covers: s.covers || [],
    tags: s.tags || [],
    accent: s.accent || 'plum',
    orderIndex: idx,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  localStore.siteDetails = {
    key: 'main',
    name: initialClinic.name || 'Onco Cure Clinic',
    tagline: initialClinic.tagline || 'Patient-centred cancer care clinic in Greater Noida',
    phone: initialClinic.contact?.primaryPhone || '+91 96569 17798',
    phoneSecondary: initialClinic.contact?.phones?.[1]?.display || '+91 87500 52773',
    whatsapp: initialClinic.contact?.whatsapp || '+91 96569 17798',
    email: initialClinic.contact?.email || 'oncocureclinic@gmail.com',
    address: {
      line1: initialClinic.contact?.addressLines?.[0] || 'A-08, Upper Ground Floor',
      line2: initialClinic.contact?.addressLines?.[1] || 'Omaxe India Trade Centre',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201310',
      mapUrl: initialClinic.contact?.mapsUrl || 'https://maps.app.goo.gl/rSbwSjq1cgw98RBg7',
    },
    hours: initialClinic.hours || [],
    socials: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
    },
    metaDefaults: {
      title: initialClinic.meta?.title || 'Onco Cure Clinic · Cancer Care in Greater Noida',
      description: initialClinic.meta?.description || 'Patient-centred oncology clinic in Greater Noida led by Dr Sahil Bambroo.',
      keywords: 'cancer doctor greater noida, oncologist noida, medical oncologist dr sahil bambroo',
    },
    updatedAt: new Date().toISOString(),
  };

  localStore.pageSeo = [...initialPageSeos];
  localStore.adminAccount = { ...initialAdminAccount };

  saveLocalStore();
}

let mongoConnectingPromise = null;

async function initMongo() {
  if (isMongoConnected && mongoose.connection.readyState === 1) return;
  if (mongoConnectingPromise) return mongoConnectingPromise;

  mongoConnectingPromise = (async () => {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB at', MONGODB_URI);

      // Seed Mongo if empty
      const blogCount = await Blog.countDocuments();
      if (blogCount === 0) {
        console.log('🌱 Seeding initial data into MongoDB...');
        for (const b of localStore.blogs) {
          await Blog.create(b);
        }
        for (const s of localStore.services) {
          await Service.create(s);
        }
        if (localStore.siteDetails) {
          await SiteDetails.create(localStore.siteDetails);
        }
      }

      const pageSeoCount = await PageSeo.countDocuments();
      if (pageSeoCount === 0) {
        console.log('🌱 Seeding Page SEO metadata into MongoDB...');
        for (const p of initialPageSeos) {
          await PageSeo.create(p);
        }
      }

      const adminCount = await AdminAccount.countDocuments();
      if (adminCount === 0) {
        console.log('🌱 Seeding Admin Account into MongoDB...');
        await AdminAccount.create(initialAdminAccount);
      }
    } catch (err) {
      isMongoConnected = false;
      console.log('ℹ️ MongoDB server not reachable (' + err.message + '). Using persistent JSON store fallback.');
      loadLocalStore();
    } finally {
      mongoConnectingPromise = null;
    }
  })();

  return mongoConnectingPromise;
}

// -----------------------------------------------------------------------------
// Authentication Middleware (Stateless HMAC-signed Token & Cookie support)
// -----------------------------------------------------------------------------
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'oncocure_secret_admin_token_2026';

let adminLastLogoutAt = 0;

function signToken(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, hmac] = parts;
  try {
    const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
    if (hmac.length !== expectedHmac.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    if (payload.iat && payload.iat < adminLastLogoutAt) return null;
    return payload;
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const cookieHeader = req.headers.cookie || '';
  const cookieMatch = cookieHeader.match(/oncocure_admin_token=([^;]+)/);
  const cookieToken = cookieMatch ? cookieMatch[1] : '';

  const token = bearerToken || cookieToken;
  if (token) {
    const verified = verifyToken(token);
    if (verified) {
      req.adminUser = verified;
      return next();
    }
  }
  return res.status(401).json({ error: 'Unauthorized: Administrator authentication required.' });
}

// -----------------------------------------------------------------------------
// Multer setup for direct file uploads (Restricted to safe image formats)
// -----------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (allowed.includes(ext) && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only safe image files (jpg, png, webp, gif) are allowed.'));
    }
  },
});

// =============================================================================
// API ROUTES
// =============================================================================

// Health check (Public)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: isMongoConnected ? 'mongodb' : 'json_store',
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// File & Remote Image Uploads (Feature 3.4)
// -----------------------------------------------------------------------------
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const publicPath = `/images/uploads/${req.file.filename}`;
  res.json({ url: publicPath, filename: req.file.filename });
});

function isPrivateHost(hostname) {
  const lower = (hostname || '').toLowerCase();
  return (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower === '0.0.0.0' ||
    lower.startsWith('10.') ||
    lower.startsWith('192.168.') ||
    lower.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)
  );
}

// Fetch and re-host remote images during rich paste (Protected + SSRF-safe)
app.post('/api/fetch-remote-image', authMiddleware, async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing remote image url' });
  }

  // If already a local image, return as is
  if (url.startsWith('/images/')) {
    return res.json({ url });
  }

  // Handle data URLs
  if (url.startsWith('data:image/')) {
    try {
      const matches = url.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        if (!['jpg', 'png', 'webp', 'gif'].includes(ext)) {
          return res.status(400).json({ error: 'Unsupported image format' });
        }
        const base64Data = matches[2];
        const filename = `pasted_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        return res.json({ url: `/images/uploads/${filename}` });
      }
    } catch (err) {
      console.error('Error saving base64 image:', err);
      return res.status(400).json({ error: 'Failed to process base64 image' });
    }
  }

  // Handle HTTP/HTTPS remote URL with SSRF guards
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({ error: 'Invalid URL protocol' });
    }
    if (isPrivateHost(parsed.hostname)) {
      return res.status(403).json({ error: 'Access to internal or private addresses is forbidden' });
    }

    const client = parsed.protocol === 'https:' ? https : http;
    const filename = `remote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`;
    const destPath = path.join(UPLOADS_DIR, filename);

    const fileStream = fs.createWriteStream(destPath);
    const request = client.get(url, (response) => {
      const contentType = response.headers['content-type'] || '';
      if (response.statusCode !== 200 || !contentType.startsWith('image/')) {
        fileStream.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return res.status(400).json({ error: 'Remote URL did not return a valid image' });
      }
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        res.json({ url: `/images/uploads/${filename}` });
      });
    });

    request.on('error', (err) => {
      console.error('Failed to download remote image:', err.message);
      fileStream.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      res.status(502).json({ error: 'Failed to download remote image' });
    });

    request.setTimeout(6000, () => {
      request.destroy();
      fileStream.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      res.status(504).json({ error: 'Remote image download timed out' });
    });
  } catch (err) {
    console.error('Remote fetch exception:', err);
    res.status(400).json({ error: 'Invalid remote URL' });
  }
});

// -----------------------------------------------------------------------------
// BLOGS CRUD (Features 1, 2, 3)
// -----------------------------------------------------------------------------
app.get('/api/blogs', async (req, res) => {
  try {
    const { q = '', category = '', status = '', offset = 0, limit = 50 } = req.query;
    let list = [];

    if (isMongoConnected) {
      const filter = {};
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { excerpt: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } },
        ];
      }
      const total = await Blog.countDocuments(filter);
      const items = await Blog.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit));
      return res.json({ items, total, offset: Number(offset), limit: Number(limit) });
    }

    list = [...localStore.blogs];
    if (category) list = list.filter((b) => b.category === category);
    if (status) list = list.filter((b) => b.status === status);
    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.excerpt.toLowerCase().includes(query) ||
          b.slug.toLowerCase().includes(query)
      );
    }
    list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const total = list.length;
    const items = list.slice(Number(offset), Number(offset) + Number(limit));
    res.json({ items, total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/blogs/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    if (isMongoConnected) {
      const blog = await Blog.findOne({ $or: [{ slug: slugOrId }, { id: slugOrId }] });
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      return res.json(blog);
    }
    const blog = localStore.blogs.find((b) => b.slug === slugOrId || b.id === slugOrId);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt = '',
      content = '',
      category = 'Oncology',
      image = '/images/photo/doctor-writing.png',
      imageAlt = '',
      date = new Date().toISOString().split('T')[0],
      readTime = '5 min read',
      status = 'published',
      metaTitle = null,
      metaKeywords = null,
      metaDescription = null,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required.' });
    }

    // Sanitize rich HTML content using extended allowlist (Feature 3.6)
    const sanitizedContent = sanitizeHtml(content);

    const doc = {
      id: `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      slug: slug.trim().toLowerCase(),
      title: title.trim(),
      excerpt: excerpt.trim() || generatePlainTextExcerpt(sanitizedContent, 160),
      content: sanitizedContent,
      category,
      image,
      imageAlt,
      date,
      readTime,
      status,
      // Feature 1: Persist SEO meta tags
      metaTitle: metaTitle ? metaTitle.trim().slice(0, 255) : null,
      metaKeywords: metaKeywords ? metaKeywords.trim().slice(0, 500) : null,
      metaDescription: metaDescription ? metaDescription.trim().slice(0, 500) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      const created = await Blog.create(doc);
      return res.status(201).json(created);
    }

    // Check duplicate slug in localStore
    const existingIdx = localStore.blogs.findIndex((b) => b.slug === doc.slug);
    if (existingIdx !== -1) {
      doc.slug = `${doc.slug}-${Date.now().toString().slice(-4)}`;
    }
    localStore.blogs.unshift(doc);
    saveLocalStore();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Sanitize content if updated (Feature 3.6)
    if (typeof updates.content === 'string') {
      updates.content = sanitizeHtml(updates.content);
    }

    // Feature 1: Clean and constrain SEO meta tags
    if (updates.metaTitle !== undefined) {
      updates.metaTitle = updates.metaTitle ? updates.metaTitle.trim().slice(0, 255) : null;
    }
    if (updates.metaKeywords !== undefined) {
      updates.metaKeywords = updates.metaKeywords ? updates.metaKeywords.trim().slice(0, 500) : null;
    }
    if (updates.metaDescription !== undefined) {
      updates.metaDescription = updates.metaDescription ? updates.metaDescription.trim().slice(0, 500) : null;
    }
    updates.updatedAt = new Date().toISOString();

    if (isMongoConnected) {
      const updated = await Blog.findOneAndUpdate(
        { $or: [{ id }, { slug: id }] },
        updates,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Blog not found' });
      return res.json(updated);
    }

    const idx = localStore.blogs.findIndex((b) => b.id === id || b.slug === id);
    if (idx === -1) return res.status(404).json({ error: 'Blog not found' });

    localStore.blogs[idx] = { ...localStore.blogs[idx], ...updates };
    saveLocalStore();
    res.json(localStore.blogs[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Blog.findOneAndDelete({ $or: [{ id }, { slug: id }] });
      return res.json({ success: true, id });
    }
    localStore.blogs = localStore.blogs.filter((b) => b.id !== id && b.slug !== id);
    saveLocalStore();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// SERVICES CRUD
// -----------------------------------------------------------------------------
app.get('/api/services', async (_req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Service.find().sort({ orderIndex: 1, createdAt: 1 });
      return res.json({ items, total: items.length });
    }
    res.json({ items: localStore.services, total: localStore.services.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/services', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      slug,
      group = 'Medical Oncology',
      summary = '',
      description = '',
      covers = [],
      tags = [],
      accent = 'plum',
      image = '/images/photo/consult-care.jpg',
      metaTitle = null,
      metaKeywords = null,
      metaDescription = null,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const doc = {
      id: `svc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      slug: (slug || '').trim().toLowerCase(),
      title: title.trim(),
      group: group.trim(),
      summary: summary.trim(),
      description: description.trim(),
      covers: Array.isArray(covers) ? covers : [],
      tags: Array.isArray(tags) ? tags : [],
      accent: accent || 'plum',
      image: image || '/images/photo/consult-care.jpg',
      orderIndex: Number(req.body.orderIndex) || localStore.services.length,
      // SEO Meta Tags per service
      metaTitle: metaTitle ? String(metaTitle).trim().slice(0, 255) : null,
      metaKeywords: metaKeywords ? String(metaKeywords).trim().slice(0, 500) : null,
      metaDescription: metaDescription ? String(metaDescription).trim().slice(0, 500) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      const created = await Service.create(doc);
      return res.status(201).json(created);
    }

    localStore.services.push(doc);
    saveLocalStore();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    // Clean and constrain SEO meta tags if provided
    if ('metaTitle' in updates) {
      updates.metaTitle = updates.metaTitle ? String(updates.metaTitle).trim().slice(0, 255) : null;
    }
    if ('metaKeywords' in updates) {
      updates.metaKeywords = updates.metaKeywords ? String(updates.metaKeywords).trim().slice(0, 500) : null;
    }
    if ('metaDescription' in updates) {
      updates.metaDescription = updates.metaDescription ? String(updates.metaDescription).trim().slice(0, 500) : null;
    }

    if (isMongoConnected) {
      const updated = await Service.findOneAndUpdate(
        { $or: [{ id }, { slug: id }] },
        updates,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Service not found' });
      return res.json(updated);
    }

    const idx = localStore.services.findIndex((s) => s.id === id || s.slug === id);
    if (idx === -1) return res.status(404).json({ error: 'Service not found' });
    localStore.services[idx] = { ...localStore.services[idx], ...updates };
    saveLocalStore();
    res.json(localStore.services[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Service.findOneAndDelete({ $or: [{ id }, { slug: id }] });
      return res.json({ success: true, id });
    }
    localStore.services = localStore.services.filter((s) => s.id !== id && s.slug !== id);
    saveLocalStore();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// CONSULTATIONS (Form Submissions)
// -----------------------------------------------------------------------------
app.get('/api/consultations', authMiddleware, async (_req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Consultation.find().sort({ createdAt: -1 });
      return res.json({ items, total: items.length });
    }
    res.json({ items: localStore.consultations, total: localStore.consultations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/consultations', async (req, res) => {
  try {
    const { name, phone, email = '', concern = '', message = '' } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const doc = {
      id: `consult-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      concern: concern.trim(),
      message: message.trim(),
      status: 'new',
      notes: '',
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      const created = await Consultation.create(doc);
      return res.status(201).json(created);
    }

    localStore.consultations.unshift(doc);
    saveLocalStore();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/consultations/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    if (isMongoConnected) {
      const updated = await Consultation.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'Consultation not found' });
      return res.json(updated);
    }

    const idx = localStore.consultations.findIndex((c) => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Consultation not found' });
    localStore.consultations[idx] = { ...localStore.consultations[idx], ...updates };
    saveLocalStore();
    res.json(localStore.consultations[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/consultations/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Consultation.findOneAndDelete({ id });
      return res.json({ success: true, id });
    }
    localStore.consultations = localStore.consultations.filter((c) => c.id !== id);
    saveLocalStore();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// CONTACTS (Inquiries)
// -----------------------------------------------------------------------------
app.get('/api/contacts', authMiddleware, async (_req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Contact.find().sort({ createdAt: -1 });
      return res.json({ items, total: items.length });
    }
    res.json({ items: localStore.contacts, total: localStore.contacts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone = '', subject = 'General Inquiry', message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const doc = {
      id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      notes: '',
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      const created = await Contact.create(doc);
      return res.status(201).json(created);
    }

    localStore.contacts.unshift(doc);
    saveLocalStore();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    if (isMongoConnected) {
      const updated = await Contact.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'Contact not found' });
      return res.json(updated);
    }

    const idx = localStore.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
    localStore.contacts[idx] = { ...localStore.contacts[idx], ...updates };
    saveLocalStore();
    res.json(localStore.contacts[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Contact.findOneAndDelete({ id });
      return res.json({ success: true, id });
    }
    localStore.contacts = localStore.contacts.filter((c) => c.id !== id);
    saveLocalStore();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// SITE DETAILS
// -----------------------------------------------------------------------------
app.get('/api/site-details', async (_req, res) => {
  try {
    if (isMongoConnected) {
      let details = await SiteDetails.findOne({ key: 'main' });
      if (!details) {
        details = await SiteDetails.create(localStore.siteDetails);
      }
      return res.json(details);
    }
    res.json(localStore.siteDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-details', authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    if (isMongoConnected) {
      const updated = await SiteDetails.findOneAndUpdate(
        { key: 'main' },
        updates,
        { new: true, upsert: true }
      );
      return res.json(updated);
    }

    localStore.siteDetails = { ...localStore.siteDetails, ...updates };
    saveLocalStore();
    res.json(localStore.siteDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// PAGE SEO MANAGEMENT (Static pages: Home, About, Services, Blogs, Contact)
// -----------------------------------------------------------------------------
app.get('/api/page-seo', async (_req, res) => {
  try {
    if (isMongoConnected) {
      const items = await PageSeo.find().sort({ createdAt: 1 });
      if (items.length === 0) {
        const seeded = await PageSeo.insertMany(initialPageSeos);
        return res.json({ items: seeded, total: seeded.length });
      }
      return res.json({ items, total: items.length });
    }
    if (!Array.isArray(localStore.pageSeo) || localStore.pageSeo.length === 0) {
      localStore.pageSeo = [...initialPageSeos];
      saveLocalStore();
    }
    res.json({ items: localStore.pageSeo, total: localStore.pageSeo.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/page-seo/by-path', async (req, res) => {
  try {
    const rawPath = (req.query.path || '/').trim();
    const targetPath = rawPath === '/' ? '/' : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`).replace(/\/$/, '');

    if (isMongoConnected) {
      const match = await PageSeo.findOne({ path: targetPath });
      if (match) return res.json(match);
      const seededMatch = initialPageSeos.find((p) => p.path === targetPath);
      if (seededMatch) return res.json(seededMatch);
      return res.status(404).json({ error: 'Page SEO not found for path ' + targetPath });
    }

    const match = (localStore.pageSeo || []).find((p) => p.path === targetPath) ||
      initialPageSeos.find((p) => p.path === targetPath);
    if (match) return res.json(match);
    res.status(404).json({ error: 'Page SEO not found for path ' + targetPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/page-seo/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      label,
      metaTitle = '',
      metaKeywords = '',
      metaDescription = '',
      canonicalUrl = '',
    } = req.body;

    const updates = {
      metaTitle: String(metaTitle || '').trim().slice(0, 255),
      metaKeywords: String(metaKeywords || '').trim().slice(0, 500),
      metaDescription: String(metaDescription || '').trim().slice(0, 500),
      canonicalUrl: String(canonicalUrl || '').trim().slice(0, 500),
      updatedAt: new Date().toISOString(),
    };
    if (label) updates.label = String(label).trim();

    if (isMongoConnected) {
      const updated = await PageSeo.findOneAndUpdate(
        { $or: [{ id }, { path: id }] },
        updates,
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Page SEO record not found' });
      return res.json(updated);
    }

    const idx = (localStore.pageSeo || []).findIndex((p) => p.id === id || p.path === id);
    if (idx === -1) return res.status(404).json({ error: 'Page SEO record not found' });
    localStore.pageSeo[idx] = { ...localStore.pageSeo[idx], ...updates };
    saveLocalStore();
    res.json(localStore.pageSeo[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// ADMIN ACCOUNT MANAGEMENT (Profile, credentials, username, avatar)
// -----------------------------------------------------------------------------
app.get('/api/admin/profile', authMiddleware, async (_req, res) => {
  try {
    if (isMongoConnected) {
      let acc = await AdminAccount.findOne();
      if (!acc) {
        acc = await AdminAccount.create(initialAdminAccount);
      }
      return res.json({
        username: acc.username,
        name: acc.name,
        email: acc.email,
        image: acc.image,
        role: acc.role,
      });
    }

    const acc = localStore.adminAccount || initialAdminAccount;
    res.json({
      username: acc.username,
      name: acc.name,
      email: acc.email,
      image: acc.image,
      role: acc.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/profile', authMiddleware, async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      image,
      currentPassword,
      newPassword,
    } = req.body;

    if (isMongoConnected) {
      let acc = await AdminAccount.findOne();
      if (!acc) {
        acc = await AdminAccount.create(initialAdminAccount);
      }

      if (newPassword && newPassword.trim()) {
        if (!currentPassword || currentPassword !== acc.password) {
          return res.status(400).json({ error: 'Current password does not match.' });
        }
        acc.password = newPassword.trim();
      }

      if (username) acc.username = username.trim();
      if (name) acc.name = name.trim();
      if (email !== undefined) acc.email = email.trim();
      if (image) acc.image = image.trim();

      await acc.save();
      return res.json({
        success: true,
        user: {
          username: acc.username,
          name: acc.name,
          email: acc.email,
          image: acc.image,
          role: acc.role,
        },
      });
    }

    const acc = localStore.adminAccount || { ...initialAdminAccount };

    if (newPassword && newPassword.trim()) {
      if (!currentPassword || currentPassword !== acc.password) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
      acc.password = newPassword.trim();
    }

    if (username) acc.username = username.trim();
    if (name) acc.name = name.trim();
    if (email !== undefined) acc.email = email.trim();
    if (image) acc.image = image.trim();

    localStore.adminAccount = acc;
    saveLocalStore();

    res.json({
      success: true,
      user: {
        username: acc.username,
        name: acc.name,
        email: acc.email,
        image: acc.image,
        role: acc.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const u = username.trim().toLowerCase();
    const p = String(password);

    let acc = null;
    if (isMongoConnected) {
      acc = await AdminAccount.findOne();
    }
    if (!acc) {
      acc = localStore.adminAccount || initialAdminAccount;
    }

    if (acc && acc.username.toLowerCase() === u && acc.password === p) {
      const token = signToken({
        username: acc.username,
        role: acc.role,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days valid
      });
      res.setHeader(
        'Set-Cookie',
        `oncocure_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      );
      return res.json({
        success: true,
        token,
        user: {
          username: acc.username,
          name: acc.name,
          email: acc.email,
          image: acc.image,
          role: acc.role,
        },
      });
    }

    res.status(401).json({ error: 'Invalid administrator credentials.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/logout', (_req, res) => {
  adminLastLogoutAt = Date.now();
  res.setHeader(
    'Set-Cookie',
    'oncocure_admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
  );
  res.json({ success: true });
});

export { app, loadLocalStore };

// Start listening
loadLocalStore();
if (process.env.NODE_ENV !== 'test') {
  initMongo().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Onco Cure API Server listening on http://localhost:${PORT}`);
    });
  });
}
