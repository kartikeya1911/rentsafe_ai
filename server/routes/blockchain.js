import express from 'express';
import crypto from 'crypto';
import Agreement from '../models/Agreement.js';

const router = express.Router();

// Verify blockchain hash
router.post('/verify-hash', async (req, res) => {
  try {
    const { agreementId, hash } = req.body;

    const agreement = await Agreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    const isValid = agreement.blockchain.hash === hash;

    res.json({
      valid: isValid,
      blockchainData: agreement.blockchain,
      message: isValid ? 'Hash verified successfully' : 'Hash verification failed'
    });
  } catch (error) {
    console.error('Error verifying hash:', error);
    res.status(500).json({ message: 'Error verifying hash', error: error.message });
  }
});

// Get blockchain info for agreement
router.get('/agreement/:id', async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ]
    }).select('blockchain');

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    res.json({
      blockchainData: agreement.blockchain,
      timestamp: agreement.createdAt
    });
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    res.status(500).json({ message: 'Error fetching blockchain data', error: error.message });
  }
});

// Simulate blockchain transaction
router.post('/create-transaction', async (req, res) => {
  try {
    const { data, type = 'agreement' } = req.body;

    // Simulate blockchain transaction
    const transaction = {
      hash: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      blockNumber: Math.floor(Math.random() * 1000000).toString(),
      transactionId: crypto.randomBytes(32).toString('hex'),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      timestamp: new Date(),
      type,
      verified: true
    };

    res.json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
});

export default router;