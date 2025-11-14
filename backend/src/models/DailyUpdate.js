import mongoose from 'mongoose';

const DailyUpdateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    plantName: { type: String, required: true },
    details: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('DailyUpdate', DailyUpdateSchema);


