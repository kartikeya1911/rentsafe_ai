import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, MapPin, Home, Bed, IndianRupee } from 'lucide-react';

interface FilterProps {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const PropertyFilters: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  onToggleFilters
}) => {
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Commercial' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleFilters}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-700">Advanced Filters</span>
        </button>

        {Object.values(filters).some(value => value) && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="text-sm">Clear All</span>
          </button>
        )}
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Home className="h-4 w-4" />
                <span>Property Type</span>
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => onFilterChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Bed className="h-4 w-4" />
                <span>Bedrooms</span>
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => onFilterChange('bedrooms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            {/* Furnished Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Furnished</label>
              <select
                value={filters.furnished}
                onChange={(e) => onFilterChange('furnished', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Any</option>
                <option value="fully">Fully Furnished</option>
                <option value="semi">Semi Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <IndianRupee className="h-4 w-4" />
                <span>Min Rent</span>
              </label>
              <input
                type="number"
                placeholder="10,000"
                value={filters.minRent}
                onChange={(e) => onFilterChange('minRent', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <IndianRupee className="h-4 w-4" />
                <span>Max Rent</span>
              </label>
              <input
                type="number"
                placeholder="50,000"
                value={filters.maxRent}
                onChange={(e) => onFilterChange('maxRent', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyFilters;