import mongoose from 'mongoose';

const ConsultRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    problem: { type: String, required: true },
    status: { type: String, enum: ['new', 'reviewed', 'contacted'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('ConsultRequest', ConsultRequestSchema);



