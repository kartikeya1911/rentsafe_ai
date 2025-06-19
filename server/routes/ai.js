import express from 'express';
import Agreement from '../models/Agreement.js';
import Property from '../models/Property.js';

const router = express.Router();

// Simulate AI analysis for agreement
router.post('/analyze-agreement', async (req, res) => {
  try {
    const { agreementId, clauses } = req.body;

    // Simulate AI analysis (in production, this would call an actual AI service)
    const mockAnalysis = {
      riskScore: Math.floor(Math.random() * 30) + 10, // 10-40 (low to medium risk)
      flaggedClauses: [
        {
          clause: "Security deposit exceeds 3 months rent",
          risk: "medium",
          explanation: "High security deposits may indicate unreasonable landlord practices"
        },
        {
          clause: "Maintenance responsibility unclear",
          risk: "low",
          explanation: "Consider clarifying who handles minor vs major repairs"
        }
      ],
      suggestions: [
        "Consider negotiating a lower security deposit",
        "Add clear maintenance responsibility clauses",
        "Include termination notice period details",
        "Specify utility bill responsibilities"
      ],
      fairnessScore: Math.floor(Math.random() * 20) + 70, // 70-90 (fair to very fair)
      analyzedAt: new Date()
    };

    // Update agreement with AI analysis
    if (agreementId) {
      await Agreement.findByIdAndUpdate(agreementId, {
        aiAnalysis: mockAnalysis
      });
    }

    res.json({
      message: 'Agreement analysis completed',
      analysis: mockAnalysis
    });
  } catch (error) {
    console.error('Error analyzing agreement:', error);
    res.status(500).json({ message: 'Error analyzing agreement', error: error.message });
  }
});

// Suggest fair rent for property
router.post('/suggest-rent', async (req, res) => {
  try {
    const { propertyId, location, bedrooms, area, propertyType } = req.body;

    // Simulate AI rent analysis
    const baseRent = {
      'apartment': 15000,
      'house': 25000,
      'room': 8000,
      'studio': 12000,
      'commercial': 30000
    }[propertyType] || 15000;

    const locationMultiplier = {
      'mumbai': 2.5,
      'delhi': 2.2,
      'bangalore': 1.8,
      'pune': 1.5,
      'chennai': 1.4,
      'hyderabad': 1.3
    }[location?.toLowerCase()] || 1.0;

    const bedroomMultiplier = Math.max(1, (bedrooms || 1) * 0.8);
    const areaMultiplier = area ? Math.max(0.5, area / 1000) : 1;

    const suggestedRent = Math.floor(baseRent * locationMultiplier * bedroomMultiplier * areaMultiplier);
    const rentRange = {
      min: Math.floor(suggestedRent * 0.85),
      max: Math.floor(suggestedRent * 1.15)
    };

    const mockRentAnalysis = {
      suggested: suggestedRent,
      range: rentRange,
      confidence: Math.floor(Math.random() * 20) + 75, // 75-95% confidence
      factors: [
        `Location: ${location} (${locationMultiplier}x multiplier)`,
        `Bedrooms: ${bedrooms} rooms`,
        `Area: ${area} sq ft`,
        `Property type: ${propertyType}`,
        'Market trends for similar properties'
      ],
      marketComparison: {
        average: Math.floor(suggestedRent * 0.95),
        percentile: Math.floor(Math.random() * 30) + 60 // 60-90th percentile
      },
      lastAnalyzed: new Date()
    };

    // Update property with AI analysis if propertyId provided
    if (propertyId) {
      await Property.findByIdAndUpdate(propertyId, {
        aiAnalysis: {
          fairRent: mockRentAnalysis,
          marketComparison: mockRentAnalysis.marketComparison,
          lastAnalyzed: new Date()
        }
      });
    }

    res.json({
      message: 'Rent analysis completed',
      analysis: mockRentAnalysis
    });
  } catch (error) {
    console.error('Error analyzing rent:', error);
    res.status(500).json({ message: 'Error analyzing rent', error: error.message });
  }
});

// Get market insights
router.get('/market-insights', async (req, res) => {
  try {
    const { city, propertyType } = req.query;

    // Mock market insights
    const insights = {
      averageRent: {
        'apartment': Math.floor(Math.random() * 15000) + 20000,
        'house': Math.floor(Math.random() * 20000) + 35000,
        'room': Math.floor(Math.random() * 5000) + 8000
      },
      trends: {
        lastMonth: Math.floor(Math.random() * 10) - 5, // -5% to +5%
        lastQuarter: Math.floor(Math.random() * 20) - 10,
        demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
      },
      recommendations: [
        'Best time to rent: Winter months typically offer better deals',
        'Average deposit: 2-3 months rent in this area',
        'Popular amenities: Parking, gym, security'
      ]
    };

    res.json({
      city,
      propertyType,
      insights,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(500).json({ message: 'Error fetching insights', error: error.message });
  }
});

export default router;