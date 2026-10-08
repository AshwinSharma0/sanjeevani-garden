import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  specialization: {
    type: String,
    required: true,
  },

  experience: {
    type: Number,
    required: true,
  },

  fees: {
    type: Number,
    required: true,
  },

  hospital: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },

  phone: {
    type: String,
  },

  image: {
    type: String,
  },

  availableDays: {
    type: [String],
  },
},
{ timestamps: true }
);

export default mongoose.models.Doctor ||
mongoose.model("Doctor", DoctorSchema);