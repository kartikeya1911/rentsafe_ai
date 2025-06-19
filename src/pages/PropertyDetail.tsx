import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Shield,
  Heart,
  Share2,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Car,
  Zap,
  Home,
  Users,
  Clock,
  TrendingUp,
  Brain,
  FileText,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GradientCard from '../components/common/GradientCard';

interface Property {
  _id: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyType: string;
  rent: {
    monthly: number;
    deposit: number;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: string;
  };
  images: string[];
  landlord: {
    _id: string;
    name: string;
    verified: boolean;
    trustScore: number;
    rating: {
      average: number;
      count: number;
    };
    phone?: string;
    email?: string;
  };
  views: number;
  amenities?: string[];
  features?: string[];
  utilities?: {
    included: string[];
    excluded: string[];
  };
  aiAnalysis?: {
    fairRent: {
      suggested: number;
      confidence: number;
      factors: string[];
    };
    marketComparison: {
      average: number;
      percentile: number;
    };
  };
  createdAt: string;
}

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/properties/${propertyId}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgreement = () => {
    if (!user) {
      toast.error('Please login to create an agreement');
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      toast.error('Only tenants can create rental agreements');
      return;
    }

    navigate(`/create-agreement/${property?._id}`);
  };

  const handleContactLandlord = () => {
    if (!user) {
      toast.error('Please login to contact the landlord');
      navigate('/login');
      return;
    }
    setShowContactInfo(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
          <Link to="/properties" className="text-blue-600 hover:text-blue-500">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ];

  const amenityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'parking': Car,
    'power_backup': Zap,
    'gym': Users,
    'security': Shield,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/properties"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GradientCard className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {property.propertyType}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{property.views} views</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.specifications.bedrooms > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg font-semibold text-gray-900">{property.specifications.bedrooms}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                    )}
                    {property.specifications.bathrooms > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <Bath className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg font-semibold text-gray-900">{property.specifications.bathrooms}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    )}
                    {property.specifications.area > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <Square className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg font-semibold text-gray-900">{property.specifications.area}</div>
                        <div className="text-sm text-gray-600">Sq Ft</div>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <Home className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-gray-900 capitalize">{property.specifications.furnished}</div>
                      <div className="text-sm text-gray-600">Furnished</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity.toLowerCase()] || CheckCircle;
                          return (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                              <IconComponent className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {amenity.replace('_', ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Utilities */}
                  {property.utilities && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Utilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.utilities.included && property.utilities.included.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Included</h4>
                            <div className="space-y-2">
                              {property.utilities.included.map((utility, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-gray-700 capitalize">{utility}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {property.utilities.excluded && property.utilities.excluded.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Not Included</h4>
                            <div className="space-y-2">
                              {property.utilities.excluded.map((utility, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-gray-700 capitalize">{utility}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </GradientCard>
            </motion.div>

            {/* AI Analysis */}
            {property.aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GradientCard className="p-8" gradient="from-purple-500 to-pink-500">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">AI Market Analysis</h3>
                        <p className="text-gray-600">Powered by advanced market intelligence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Fair Rent Analysis</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">AI Suggested Rent</span>
                            <span className="font-bold text-green-600">
                              ₹{property.aiAnalysis.fairRent.suggested.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Listing</span>
                            <span className="font-bold text-gray-900">
                              ₹{property.rent.monthly.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Confidence</span>
                            <span className="font-bold text-blue-600">
                              {property.aiAnalysis.fairRent.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Market Comparison</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Area Average</span>
                            <span className="font-bold text-gray-900">
                              ₹{property.aiAnalysis.marketComparison.average.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Market Percentile</span>
                            <span className="font-bold text-blue-600">
                              {property.aiAnalysis.marketComparison.percentile}th
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {property.aiAnalysis.fairRent.factors && (
                      <div className="bg-white p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Analysis Factors</h4>
                        <div className="space-y-2">
                          {property.aiAnalysis.fairRent.factors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-700">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GradientCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GradientCard className="p-6 sticky top-32">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      ₹{property.rent.monthly.toLocaleString()}
                    </div>
                    <div className="text-gray-600">per month</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Security Deposit: ₹{property.rent.deposit.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleContactLandlord}
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Contact Landlord
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                      Schedule Visit
                    </button>
                    <button 
                      onClick={handleCreateAgreement}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Create Agreement</span>
                    </button>
                  </div>

                  {showContactInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t pt-4 space-y-3"
                    >
                      {property.landlord.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{property.landlord.phone}</span>
                        </div>
                      )}
                      {property.landlord.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{property.landlord.email}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </GradientCard>
            </motion.div>

            {/* Landlord Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GradientCard className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Property Owner</h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {property.landlord.name.charAt(0)}
                        </span>
                      </div>
                      {property.landlord.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.landlord.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {property.landlord.rating?.average?.toFixed(1) || 'New'} 
                            {property.landlord.rating?.count > 0 && ` (${property.landlord.rating.count} reviews)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Trust Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${property.landlord.trustScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {property.landlord.trustScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/landlord/${property.landlord._id}`}
                    className="block text-center text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View Profile & Reviews
                  </Link>
                </div>
              </GradientCard>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GradientCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Listed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Views</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{property.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Response Time</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Within 2 hours</span>
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;