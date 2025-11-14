import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertName: { type: String },
    scheduledAt: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: ['requested', 'confirmed', 'completed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true }
);

export default mongoose.model('Consultation', ConsultationSchema);


