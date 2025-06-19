import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  FileText, 
  Star, 
  Calendar,
  MapPin,
  IndianRupee,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GradientCard from '../../components/common/GradientCard';

interface Agreement {
  _id: string;
  property: {
    _id: string;
    title: string;
    address: {
      city: string;
      state: string;
    };
    images: string[];
  };
  landlord: {
    name: string;
    avatar?: string;
  };
  terms: {
    monthlyRent: number;
    startDate: string;
    endDate: string;
  };
  status: string;
  createdAt: string;
}

interface SavedProperty {
  _id: string;
  title: string;
  address: {
    city: string;
    state: string;
  };
  rent: {
    monthly: number;
  };
  images: string[];
  views: number;
}

const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agreements' | 'saved' | 'reviews'>('agreements');

  useEffect(() => {
    if (user?.role === 'tenant') {
      fetchTenantData();
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      
      // Fetch agreements
      const agreementsResponse = await axios.get('/api/agreements');
      setAgreements(agreementsResponse.data.agreements || []);
      
      // For demo purposes, we'll create some mock saved properties
      // In a real app, you'd have a saved properties endpoint
      setSavedProperties([]);
      
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'terminated':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (user?.role !== 'tenant') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This dashboard is only available for tenants.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>
          <Link
            to="/properties"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Properties
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GradientCard className="p-6" gradient="from-blue-500 to-cyan-500">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Agreements</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {agreements.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GradientCard className="p-6" gradient="from-purple-500 to-pink-500">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GradientCard className="p-6" gradient="from-green-500 to-teal-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Trust Score</p>
                  <p className="text-2xl font-bold text-gray-900">{user.trustScore}/100</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('agreements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'agreements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Rental Agreements ({agreements.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'saved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Saved Properties ({savedProperties.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Reviews
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Agreements Tab */}
            {activeTab === 'agreements' && (
              <div>
                {agreements.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No rental agreements yet</h3>
                    <p className="text-gray-600 mb-6">Start by browsing properties and creating your first rental agreement</p>
                    <Link
                      to="/properties"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agreements.map((agreement, index) => (
                      <motion.div
                        key={agreement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={agreement.property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300'}
                            alt={agreement.property.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {agreement.property.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agreement.status)}`}>
                                {getStatusIcon(agreement.status)}
                                <span className="ml-1 capitalize">{agreement.status}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{agreement.property.address.city}, {agreement.property.address.state}</span>
                              <span className="mx-2">•</span>
                              <span>Landlord: {agreement.landlord.name}</span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <IndianRupee className="h-4 w-4 mr-1" />
                                <span>₹{agreement.terms.monthlyRent.toLocaleString()}/month</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(agreement.terms.startDate).toLocaleDateString()} - {new Date(agreement.terms.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/agreement/${agreement._id}`}
                              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                <p className="text-gray-600 mb-6">Save properties you're interested in to easily find them later</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Browse Properties
                </Link>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">Complete rental agreements to leave reviews for landlords</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;