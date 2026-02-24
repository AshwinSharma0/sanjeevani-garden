import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;