import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    body: { type: Array, default: [] }, // structured sections for legacy fallback
    category: { type: String, default: 'Oncology' },
    image: { type: String, default: '/images/photo/doctor-writing.png' },
    imageAlt: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readTime: { type: String, default: '5 min read' },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    
    // Feature 1: SEO Meta Tags per blog
    metaTitle: { type: String, default: null, maxlength: 255 },
    metaKeywords: { type: String, default: null, maxlength: 500 },
    metaDescription: { type: String, default: null, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
