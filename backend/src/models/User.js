import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'IN' },
  },
  { _id: false }
);

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceAtAddTime: { type: Number, required: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    address: AddressSchema,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);


