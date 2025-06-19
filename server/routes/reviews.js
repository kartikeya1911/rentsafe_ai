import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Agreement from '../models/Agreement.js';

const router = express.Router();

// Create review
router.post('/', async (req, res) => {
  try {
    const { agreementId, revieweeId, rating, categories, comment } = req.body;

    // Verify agreement exists and user was part of it
    const agreement = await Agreement.findOne({
      _id: agreementId,
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ],
      status: { $in: ['completed', 'terminated'] }
    });

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found or not eligible for review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      agreement: agreementId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this agreement' });
    }

    const review = new Review({
      agreement: agreementId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      categories,
      comment
    });

    await review.save();

    // Update reviewee's rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(revieweeId, {
      'rating.average': avgRating,
      'rating.count': reviews.length
    });

    await review.populate([
      { path: 'reviewer', select: 'name avatar' },
      { path: 'reviewee', select: 'name' },
      { path: 'agreement', select: 'property', populate: { path: 'property', select: 'title' } }
    ]);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// Get user reviews
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate({
        path: 'agreement',
        populate: {
          path: 'property',
          select: 'title address'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Get my reviews (reviews I wrote)
router.get('/my-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('reviewee', 'name avatar')
      .populate({
        path: 'agreement',
        populate: {
          path: 'property',
          select: 'title address'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching my reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

export default router;