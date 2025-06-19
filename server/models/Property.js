import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'room', 'studio', 'commercial'],
    required: true
  },
  rent: {
    monthly: {
      type: Number,
      required: true
    },
    deposit: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  specifications: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // in sq ft
    furnished: {
      type: String,
      enum: ['fully', 'semi', 'unfurnished'],
      default: 'unfurnished'
    },
    parking: Boolean,
    pets: Boolean,
    smoking: Boolean
  },
  amenities: [String],
  images: [String],
  available: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  leaseTerm: {
    minimum: Number, // in months
    maximum: Number
  },
  features: [String],
  utilities: {
    included: [String],
    excluded: [String]
  },
  views: {
    type: Number,
    default: 0
  },
  aiAnalysis: {
    fairRent: {
      suggested: Number,
      confidence: Number,
      factors: [String]
    },
    marketComparison: {
      average: Number,
      percentile: Number
    },
    lastAnalyzed: Date
  },
  status: {
    type: String,
    enum: ['active', 'rented', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search functionality
propertySchema.index({ 
  title: 'text', 
  description: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

// Index for location-based queries
propertySchema.index({ 'address.coordinates': '2dsphere' });

export default mongoose.model('Property', propertySchema);