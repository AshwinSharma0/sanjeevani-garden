import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['plant', 'seed', 'herbal'], required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    availability: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    healthBenefits: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);


