import mongoose from 'mongoose';

const agreementSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  terms: {
    monthlyRent: {
      type: Number,
      required: true
    },
    securityDeposit: {
      type: Number,
      required: true
    },
    leaseDuration: {
      type: Number,
      required: true // in months
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    rentDueDate: {
      type: Number,
      default: 1 // day of month
    },
    lateFee: Number,
    maintenanceResponsibility: String,
    utilitiesIncluded: [String],
    specialClauses: [String]
  },
  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['agreement', 'id_proof', 'income_proof', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed', 'terminated'],
    default: 'draft'
  },
  signatures: {
    landlord: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      ipAddress: String
    },
    tenant: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      ipAddress: String
    }
  },
  blockchain: {
    hash: String,
    blockNumber: String,
    transactionId: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  aiAnalysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100
    },
    flaggedClauses: [{
      clause: String,
      risk: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      explanation: String
    }],
    suggestions: [String],
    fairnessScore: Number,
    analyzedAt: Date
  },
  payments: [{
    month: String,
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    method: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Agreement', agreementSchema);