import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  odioId: {
    type: String,
    required: true,
  },
  correctCount: {
    type: Number,
    required: true,
    default: 0,
  },
  wrongCount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 0,
  },
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    default: 'all',
  },
}, {
  timestamps: true,
});

scoreSchema.index({ odioId: 1, createdAt: -1 });
scoreSchema.index({ odioId: 1, percentage: -1 });

const Score = mongoose. model('Score', scoreSchema);

export default Score;