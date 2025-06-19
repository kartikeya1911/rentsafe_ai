import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  agreement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agreement',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  categories: {
    communication: Number,
    reliability: Number,
    cleanliness: Number,
    responsiveness: Number,
    overall: Number
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: true // Only verified agreements can create reviews
  },
  helpful: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one review per agreement per user
reviewSchema.index({ agreement: 1, reviewer: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);