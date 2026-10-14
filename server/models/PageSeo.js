import mongoose from 'mongoose';

const PageSeoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    metaTitle: { type: String, default: '', maxlength: 255 },
    metaKeywords: { type: String, default: '', maxlength: 500 },
    metaDescription: { type: String, default: '', maxlength: 500 },
    canonicalUrl: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.models.PageSeo || mongoose.model('PageSeo', PageSeoSchema);
