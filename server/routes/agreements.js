import express from 'express';
import crypto from 'crypto';
import Agreement from '../models/Agreement.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Create agreement
router.post('/', async (req, res) => {
  try {
    const { propertyId, terms } = req.body;

    const property = await Property.findById(propertyId).populate('landlord');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Calculate end date
    const startDate = new Date(terms.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + terms.leaseDuration);

    const agreement = new Agreement({
      property: propertyId,
      landlord: property.landlord._id,
      tenant: req.user._id,
      terms: {
        ...terms,
        endDate
      }
    });

    await agreement.save();
    await agreement.populate([
      { path: 'property', select: 'title address rent' },
      { path: 'landlord', select: 'name email phone' },
      { path: 'tenant', select: 'name email phone' }
    ]);

    // Create notifications
    await Notification.create([
      {
        user: property.landlord._id,
        type: 'property_inquiry',
        title: 'New Rental Agreement Request',
        message: `${req.user.name} has created a rental agreement for ${property.title}`,
        data: { agreementId: agreement._id }
      }
    ]);

    res.status(201).json({
      message: 'Agreement created successfully',
      agreement
    });
  } catch (error) {
    console.error('Error creating agreement:', error);
    res.status(500).json({ message: 'Error creating agreement', error: error.message });
  }
});

// Get user agreements
router.get('/', async (req, res) => {
  try {
    const query = {
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ]
    };

    const agreements = await Agreement.find(query)
      .populate('property', 'title address images')
      .populate('landlord', 'name email avatar')
      .populate('tenant', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ agreements });
  } catch (error) {
    console.error('Error fetching agreements:', error);
    res.status(500).json({ message: 'Error fetching agreements', error: error.message });
  }
});

// Get single agreement
router.get('/:id', async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ]
    })
    .populate('property')
    .populate('landlord', 'name email phone avatar')
    .populate('tenant', 'name email phone avatar');

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    res.json(agreement);
  } catch (error) {
    console.error('Error fetching agreement:', error);
    res.status(500).json({ message: 'Error fetching agreement', error: error.message });
  }
});

// Sign agreement
router.post('/:id/sign', async (req, res) => {
  try {
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ]
    });

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    const userRole = agreement.landlord.toString() === req.user._id.toString() ? 'landlord' : 'tenant';
    
    // Sign the agreement
    agreement.signatures[userRole] = {
      signed: true,
      signedAt: new Date(),
      ipAddress: req.ip
    };

    // If both parties signed, activate the agreement and store on blockchain
    if (agreement.signatures.landlord.signed && agreement.signatures.tenant.signed) {
      agreement.status = 'active';
      
      // Create blockchain hash (simulated)
      const agreementData = JSON.stringify({
        agreementId: agreement._id,
        landlord: agreement.landlord,
        tenant: agreement.tenant,
        terms: agreement.terms,
        timestamp: new Date()
      });
      
      agreement.blockchain = {
        hash: crypto.createHash('sha256').update(agreementData).digest('hex'),
        blockNumber: Math.floor(Math.random() * 1000000).toString(),
        transactionId: crypto.randomBytes(32).toString('hex'),
        verified: true
      };

      // Update property status
      await Property.findByIdAndUpdate(agreement.property, {
        status: 'rented',
        available: false
      });
    }

    await agreement.save();

    res.json({
      message: 'Agreement signed successfully',
      agreement
    });
  } catch (error) {
    console.error('Error signing agreement:', error);
    res.status(500).json({ message: 'Error signing agreement', error: error.message });
  }
});

// Update agreement status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const agreement = await Agreement.findOne({
      _id: req.params.id,
      $or: [
        { landlord: req.user._id },
        { tenant: req.user._id }
      ]
    });

    if (!agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    agreement.status = status;
    
    if (status === 'terminated' || status === 'completed') {
      // Update property status back to available
      await Property.findByIdAndUpdate(agreement.property, {
        status: 'active',
        available: true
      });
    }

    await agreement.save();

    res.json({
      message: 'Agreement status updated successfully',
      agreement
    });
  } catch (error) {
    console.error('Error updating agreement status:', error);
    res.status(500).json({ message: 'Error updating agreement', error: error.message });
  }
});

export default router;