import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal,
  MapPin, 
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  ArrowUpDown
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilters from '../components/common/PropertyFilters';

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
    name: string;
    verified: boolean;
    trustScore: number;
    rating: {
      average: number;
      count: number;
    };
  };
  views: number;
  amenities?: string[];
  createdAt: string;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    propertyType: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    furnished: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      if (sortBy) queryParams.append('sort', sortBy);

      const response = await axios.get(`http://localhost:5050/api/properties?${queryParams}`);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: '',
      minRent: '',
      maxRent: '',
      bedrooms: '',
      furnished: ''
    });
  };

  const popularSearches = [
    'Mumbai Apartments',
    'Delhi 2BHK',
    'Bangalore PG',
    'Pune Furnished',
    'Chennai Studio'
  ];

  const trendingLocations = [
    { city: 'Mumbai', count: 2500, trend: '+12%' },
    { city: 'Delhi', count: 1800, trend: '+8%' },
    { city: 'Bangalore', count: 2200, trend: '+15%' },
    { city: 'Pune', count: 1200, trend: '+10%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Rental Home
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Discover verified properties with AI-powered insights and blockchain security across India
            </motion.p>
          </div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location, property type, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="font-medium">Filters</span>
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Popular:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange('search', search)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
      </div>

      {/* Trending Locations */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Trending Locations
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingLocations.map((location, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleFilterChange('city', location.city.toLowerCase())}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {location.city}
                  </h4>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                    {location.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{location.count} properties</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {properties.length > 0 ? (
                    <>Found {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}</>
                  ) : (
                    'No properties found'
                  )}
                </h2>
                {properties.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    Showing results {filters.city && `in ${filters.city}`}
                  </p>
                )}
              </div>

              {properties.length > 0 && (
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="rent.monthly">Price: Low to High</option>
                      <option value="-rent.monthly">Price: High to Low</option>
                      <option value="views">Most Viewed</option>
                    </select>
                    <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Properties Grid/List */}
            {properties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 mb-6">
                  <Search className="h-24 w-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No properties found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search filters or browse our trending locations to find more properties.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property, index) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property} 
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {properties.length > 0 && properties.length >= 12 && (
              <div className="text-center mt-12">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Load More Properties
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;