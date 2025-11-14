import mongoose from 'mongoose';

const HerbalPlantSchema = new mongoose.Schema(
  {
    commonName: { type: String, required: true, index: true },
    scientificName: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    symptoms: { type: [String], index: true },
    description: { type: String, default: '' },
    preparation: { type: String, default: '' },
    safetyNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

HerbalPlantSchema.index({ commonName: 1, scientificName: 1 }, { unique: true });

export default mongoose.model('HerbalPlant', HerbalPlantSchema);


