import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    }
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);