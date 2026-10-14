import mongoose from 'mongoose';

const AdminAccountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Dr. Apoorva' },
    email: { type: String, default: 'dr.apoorva@oncocure.co.in' },
    image: { type: String, default: '/images/photo/drapoorva.jpeg' },
    role: { type: String, default: 'Super Administrator' },
  },
  { timestamps: true }
);

export default mongoose.models.AdminAccount || mongoose.model('AdminAccount', AdminAccountSchema);
