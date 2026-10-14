import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'Website Inquiry' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'replied', 'archived'],
      default: 'new',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
