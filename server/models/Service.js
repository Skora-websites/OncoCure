import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    group: { type: String, required: true },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    covers: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    accent: { type: String, default: 'plum' },
    image: { type: String, default: '/images/photo/consult-care.jpg' },
    orderIndex: { type: Number, default: 0 },

    // SEO Meta Tags per service
    metaTitle: { type: String, default: null, maxlength: 255 },
    metaKeywords: { type: String, default: null, maxlength: 500 },
    metaDescription: { type: String, default: null, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
