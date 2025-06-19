import express from 'express';
import Property from '../models/Property.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      city,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      furnished,
      page = 1,
      limit = 12,
      sort = 'createdAt'
    } = req.query;

    const query = { status: 'active', available: true };

    // Apply filters
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (minRent || maxRent) {
      query['rent.monthly'] = {};
      if (minRent) query['rent.monthly'].$gte = Number(minRent);
      if (maxRent) query['rent.monthly'].$lte = Number(maxRent);
    }
    if (bedrooms) query['specifications.bedrooms'] = Number(bedrooms);
    if (furnished) query['specifications.furnished'] = furnished;

    // Create sample properties if none exist
    const existingCount = await Property.countDocuments();
    if (existingCount === 0) {
      const sampleProperties = [
        {
          title: "Luxury 2BHK Apartment in Bandra West",
          description: "Beautiful fully furnished apartment with modern amenities, close to metro station and shopping centers. Perfect for working professionals.",
          landlord: "507f1f77bcf86cd799439011", // Sample ObjectId
          address: {
            street: "Hill Road, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400050"
          },
          propertyType: "apartment",
          rent: {
            monthly: 45000,
            deposit: 90000
          },
          specifications: {
            bedrooms: 2,
            bathrooms: 2,
            area: 850,
            furnished: "fully"
          },
          amenities: ["wifi", "parking", "gym", "security", "power_backup"],
          features: ["Balcony", "Modular Kitchen", "Wardrobe"],
          utilities: {
            included: ["Water", "Maintenance"],
            excluded: ["Electricity", "Gas"]
          },
          images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          views: 245,
          aiAnalysis: {
            fairRent: {
              suggested: 42000,
              confidence: 85,
              factors: ["Prime location in Bandra", "Fully furnished", "Modern amenities", "Metro connectivity"]
            },
            marketComparison: {
              average: 43500,
              percentile: 75
            }
          }
        },
        {
          title: "Spacious 3BHK House in Koramangala",
          description: "Independent house with garden, perfect for families. Located in the heart of Koramangala with easy access to IT parks.",
          landlord: "507f1f77bcf86cd799439012",
          address: {
            street: "5th Block, Koramangala",
            city: "Bangalore",
            state: "Karnataka",
            zipCode: "560095"
          },
          propertyType: "house",
          rent: {
            monthly: 35000,
            deposit: 70000
          },
          specifications: {
            bedrooms: 3,
            bathrooms: 3,
            area: 1200,
            furnished: "semi"
          },
          amenities: ["parking", "garden", "security"],
          features: ["Garden", "Terrace", "Store Room"],
          utilities: {
            included: ["Water", "Maintenance"],
            excluded: ["Electricity", "Gas", "Internet"]
          },
          images: [
            "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          views: 189,
          aiAnalysis: {
            fairRent: {
              suggested: 33000,
              confidence: 78,
              factors: ["Koramangala location", "Independent house", "Garden space", "IT park proximity"]
            },
            marketComparison: {
              average: 34000,
              percentile: 68
            }
          }
        },
        {
          title: "Modern Studio Apartment in Gurgaon",
          description: "Compact and efficient studio apartment perfect for young professionals. Located in Cyber City with excellent connectivity.",
          landlord: "507f1f77bcf86cd799439013",
          address: {
            street: "Cyber City, DLF Phase 2",
            city: "Gurgaon",
            state: "Haryana",
            zipCode: "122002"
          },
          propertyType: "studio",
          rent: {
            monthly: 25000,
            deposit: 50000
          },
          specifications: {
            bedrooms: 0,
            bathrooms: 1,
            area: 450,
            furnished: "fully"
          },
          amenities: ["wifi", "gym", "security", "power_backup"],
          features: ["Modern Kitchen", "High-speed Internet", "AC"],
          utilities: {
            included: ["Water", "Maintenance", "Internet"],
            excluded: ["Electricity"]
          },
          images: [
            "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          views: 156,
          aiAnalysis: {
            fairRent: {
              suggested: 24000,
              confidence: 82,
              factors: ["Cyber City location", "Fully furnished", "Modern amenities", "Metro connectivity"]
            },
            marketComparison: {
              average: 25500,
              percentile: 60
            }
          }
        },
        {
          title: "Comfortable 1BHK in Pune",
          description: "Well-maintained 1BHK apartment in a peaceful locality. Great for couples or single professionals working in IT companies.",
          landlord: "507f1f77bcf86cd799439014",
          address: {
            street: "Hinjewadi Phase 1",
            city: "Pune",
            state: "Maharashtra",
            zipCode: "411057"
          },
          propertyType: "apartment",
          rent: {
            monthly: 18000,
            deposit: 36000
          },
          specifications: {
            bedrooms: 1,
            bathrooms: 1,
            area: 600,
            furnished: "semi"
          },
          amenities: ["parking", "security"],
          features: ["Balcony", "Wardrobe"],
          utilities: {
            included: ["Water"],
            excluded: ["Electricity", "Gas", "Internet", "Maintenance"]
          },
          images: [
            "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          views: 98,
          aiAnalysis: {
            fairRent: {
              suggested: 17000,
              confidence: 75,
              factors: ["Hinjewadi IT hub", "Good connectivity", "Peaceful locality"]
            },
            marketComparison: {
              average: 18500,
              percentile: 55
            }
          }
        },
        {
          title: "Premium 2BHK with Sea View in Chennai",
          description: "Luxurious apartment with stunning sea view. Located on ECR with modern amenities and 24/7 security.",
          landlord: "507f1f77bcf86cd799439015",
          address: {
            street: "East Coast Road, Thiruvanmiyur",
            city: "Chennai",
            state: "Tamil Nadu",
            zipCode: "600041"
          },
          propertyType: "apartment",
          rent: {
            monthly: 32000,
            deposit: 64000
          },
          specifications: {
            bedrooms: 2,
            bathrooms: 2,
            area: 950,
            furnished: "fully"
          },
          amenities: ["wifi", "parking", "gym", "security", "swimming_pool"],
          features: ["Sea View", "Balcony", "Modern Kitchen", "Swimming Pool Access"],
          utilities: {
            included: ["Water", "Maintenance", "Internet"],
            excluded: ["Electricity"]
          },
          images: [
            "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          views: 312,
          aiAnalysis: {
            fairRent: {
              suggested: 30000,
              confidence: 88,
              factors: ["Sea view premium", "ECR location", "Luxury amenities", "Fully furnished"]
            },
            marketComparison: {
              average: 31000,
              percentile: 72
            }
          }
        }
      ];

      // Create sample landlords first (simplified for demo)
      const User = (await import('../models/User.js')).default;
      const sampleLandlords = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          password: "$2a$12$dummy.hash.for.demo.purposes.only",
          role: "landlord",
          phone: "+91 98765 43210",
          verified: true,
          rating: { average: 4.5, count: 12 },
          trustScore: 85
        },
        {
          _id: "507f1f77bcf86cd799439012",
          name: "Priya Sharma",
          email: "priya@example.com",
          password: "$2a$12$dummy.hash.for.demo.purposes.only",
          role: "landlord",
          phone: "+91 98765 43211",
          verified: true,
          rating: { average: 4.2, count: 8 },
          trustScore: 78
        },
        {
          _id: "507f1f77bcf86cd799439013",
          name: "Amit Patel",
          email: "amit@example.com",
          password: "$2a$12$dummy.hash.for.demo.purposes.only",
          role: "landlord",
          phone: "+91 98765 43212",
          verified: true,
          rating: { average: 4.7, count: 15 },
          trustScore: 92
        },
        {
          _id: "507f1f77bcf86cd799439014",
          name: "Sunita Reddy",
          email: "sunita@example.com",
          password: "$2a$12$dummy.hash.for.demo.purposes.only",
          role: "landlord",
          phone: "+91 98765 43213",
          verified: false,
          rating: { average: 4.0, count: 5 },
          trustScore: 65
        },
        {
          _id: "507f1f77bcf86cd799439015",
          name: "Vikram Singh",
          email: "vikram@example.com",
          password: "$2a$12$dummy.hash.for.demo.purposes.only",
          role: "landlord",
          phone: "+91 98765 43214",
          verified: true,
          rating: { average: 4.8, count: 20 },
          trustScore: 95
        }
      ];

      try {
        await User.insertMany(sampleLandlords, { ordered: false });
      } catch (error) {
        // Ignore duplicate key errors for demo
        console.log('Sample landlords already exist or error creating them');
      }

      try {
        await Property.insertMany(sampleProperties);
        console.log('Sample properties created');
      } catch (error) {
        console.log('Error creating sample properties:', error.message);
      }
    }

    const properties = await Property.find(query)
      .populate('landlord', 'name rating verified trustScore avatar phone email')
      .sort({ [sort]: sort.startsWith('-') ? -1 : 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name rating verified trustScore avatar phone email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment view count
    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
});

// Create property (landlords only)
router.post('/', authenticateToken, requireRole(['landlord']), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      landlord: req.user._id
    };

    const property = new Property(propertyData);
    await property.save();

    await property.populate('landlord', 'name rating verified trustScore');

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
});

// Update property
router.put('/:id', authenticateToken, requireRole(['landlord']), async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      landlord: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    Object.assign(property, req.body);
    await property.save();

    await property.populate('landlord', 'name rating verified trustScore');

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

// Delete property
router.delete('/:id', authenticateToken, requireRole(['landlord']), async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      landlord: req.user._id
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

// Get landlord's properties
router.get('/landlord/my-properties', authenticateToken, requireRole(['landlord']), async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error) {
    console.error('Error fetching landlord properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

export default router;