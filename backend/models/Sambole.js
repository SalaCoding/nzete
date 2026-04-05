import mongoose from 'mongoose';

const qaSchema = new mongoose. Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters'],
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [1000, 'Answer cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    trim: true,
    default: 'general',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  language: {
    type: String,
    default: 'none',
  },
  createdBy: {
    type: mongoose.Schema. Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Track how many times this QA has been viewed/answered
  stats: {
    timesViewed: { type: Number, default: 0 },
    timesAnsweredCorrectly: { type: Number, default: 0 },
    timesAnsweredIncorrectly: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for faster searches
qaSchema.index({ question: 'text', answer: 'text' });
qaSchema. index({ category: 1, difficulty: 1 });
qaSchema.index({ isActive: 1 });

const QA = mongoose.model('QA', qaSchema);

export default QA;