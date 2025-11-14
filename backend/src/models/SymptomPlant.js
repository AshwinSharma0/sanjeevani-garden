import mongoose from 'mongoose';

const SymptomPlantSchema = new mongoose.Schema(
  {
    symptom: { type: String, required: true, index: true },
    plantName: { type: String, required: true },
    usage: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

SymptomPlantSchema.index({ symptom: 1, plantName: 1 }, { unique: true });

export default mongoose.model('SymptomPlant', SymptomPlantSchema);


