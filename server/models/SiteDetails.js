import mongoose from 'mongoose';

const SiteDetailsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    name: { type: String, default: 'Onco Cure Clinic' },
    tagline: { type: String, default: 'Patient-centred cancer care clinic in Greater Noida' },
    phone: { type: String, default: '+91 99990 00000' },
    phoneSecondary: { type: String, default: '+91 98100 00000' },
    whatsapp: { type: String, default: '+91 99990 00000' },
    email: { type: String, default: 'care@oncocureclinic.com' },
    address: {
      line1: { type: String, default: 'Commercial Belt, Alpha 1' },
      line2: { type: String, default: 'Near Metro Station' },
      city: { type: String, default: 'Greater Noida' },
      state: { type: String, default: 'Uttar Pradesh' },
      pincode: { type: String, default: '201310' },
      mapUrl: { type: String, default: 'https://maps.google.com' },
    },
    hours: [
      {
        id: { type: String },
        label: { type: String },
        days: { type: String },
        time: { type: String },
      },
    ],
    socials: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    metaDefaults: {
      title: { type: String, default: 'Onco Cure Clinic · Cancer Care in Greater Noida' },
      description: {
        type: String,
        default:
          'Patient-centred oncology clinic in Greater Noida led by Dr Sahil Bambroo. Comprehensive medical oncology, systemic therapy and pain care.',
      },
      keywords: {
        type: String,
        default: 'oncologist greater noida, cancer doctor noida, chemotherapy daycare noida, dr sahil bambroo',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteDetails ||
  mongoose.model('SiteDetails', SiteDetailsSchema);
