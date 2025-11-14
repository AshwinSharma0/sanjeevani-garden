import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'IN' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);


