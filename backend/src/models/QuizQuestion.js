import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{
      text: String,
      points: { type: Number, default: 0 },
    }],
    category: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('QuizQuestion', QuizQuestionSchema);


