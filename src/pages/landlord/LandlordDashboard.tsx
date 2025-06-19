import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Home, 
  Users, 
  IndianRupee, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Star,
  MapPin,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GradientCard from '../../components/common/GradientCard';

interface Property {
  _id: string;
  title: string;
  address: {
    city: string;
    state: string;
  };
  propertyType: string;
  rent: {
    monthly: number;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
  images: string[];
  views: number;
  status: string;
  available: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  monthlyRevenue: number;
}

const LandlordDashboard: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'landlord') {
      fetchLandlordData();
    }
  }, [user]);

  const fetchLandlordData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/properties/landlord/my-properties');
      const propertiesData = response.data.properties;
      
      setProperties(propertiesData);
      
      // Calculate stats
      const totalViews = propertiesData.reduce((sum: number, prop: Property) => sum + prop.views, 0);
      const activeProperties = propertiesData.filter((prop: Property) => prop.available).length;
      const monthlyRevenue = propertiesData
        .filter((prop: Property) => prop.status === 'rented')
        .reduce((sum: number, prop: Property) => sum + prop.rent.monthly, 0);

      setStats({
        totalProperties: propertiesData.length,
        activeProperties,
        totalViews,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching landlord data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await axios.delete(`/api/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      fetchLandlordData();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/properties/${propertyId}`, {
        available: !currentStatus
      });
      toast.success(`Property ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchLandlordData();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  };

  if (user?.role !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This dashboard is only available for landlords.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Landlord Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>
          <Link
            to="/add-property"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GradientCard className="p-6" gradient="from-blue-500 to-cyan-500">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GradientCard className="p-6" gradient="from-green-500 to-teal-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GradientCard className="p-6" gradient="from-purple-500 to-pink-500">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GradientCard className="p-6" gradient="from-orange-500 to-red-500">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <IndianRupee className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first property to the platform</p>
              <Link
                to="/add-property"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300'}
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          property.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {property.available ? 'Active' : 'Inactive'}
                        </span>
                        {property.status === 'rented' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Rented
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.address.city}, {property.address.state}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{property.propertyType}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {property.specifications.bedrooms > 0 && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.specifications.bedrooms} bed</span>
                          </div>
                        )}
                        {property.specifications.bathrooms > 0 && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.specifications.bathrooms} bath</span>
                          </div>
                        )}
                        {property.specifications.area > 0 && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1" />
                            <span>{property.specifications.area} sq ft</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{property.views} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{property.rent.monthly.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>

                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <Link
                        to={`/property/${property._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Property"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => togglePropertyStatus(property._id, property.available)}
                        className={`p-2 rounded-lg transition-colors ${
                          property.available 
                            ? 'text-red-600 hover:bg-red-100' 
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={property.available ? 'Deactivate' : 'Activate'}
                      >
                        {property.available ? <Trash2 className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;