import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Bath, 
  Square,
  Upload,
  Plus,
  X,
  Brain,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProperty: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    propertyType: 'apartment',
    rent: {
      monthly: '',
      deposit: ''
    },
    specifications: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      furnished: 'unfurnished'
    },
    amenities: [] as string[],
    features: [] as string[],
    utilities: {
      included: [] as string[],
      excluded: [] as string[]
    },
    images: [] as string[]
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const commonAmenities = [
    'wifi', 'parking', 'gym', 'security', 'power_backup', 
    'swimming_pool', 'elevator', 'garden', 'balcony'
  ];

  const commonUtilities = [
    'Water', 'Electricity', 'Gas', 'Internet', 'Maintenance', 'Cable TV'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: newArray
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const addCustomItem = (item: string, field: string) => {
    if (item.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], item.trim()]
      }));
    }
  };

  const removeCustomItem = (index: number, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const getAiRentSuggestion = async () => {
    if (!formData.address.city || !formData.propertyType) {
      toast.error('Please fill in city and property type first');
      return;
    }

    setAiAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/suggest-rent', {
        location: formData.address.city,
        bedrooms: parseInt(formData.specifications.bedrooms) || 1,
        area: parseInt(formData.specifications.area) || 500,
        propertyType: formData.propertyType
      });

      setAiSuggestion(response.data.analysis);
      toast.success('AI rent analysis completed!');
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast.error('Failed to get AI suggestion');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role !== 'landlord') {
      toast.error('Only landlords can add properties');
      return;
    }

    setLoading(true);
    try {
      // Convert string values to numbers where needed
      const propertyData = {
        ...formData,
        rent: {
          monthly: parseInt(formData.rent.monthly),
          deposit: parseInt(formData.rent.deposit)
        },
        specifications: {
          ...formData.specifications,
          bedrooms: parseInt(formData.specifications.bedrooms) || 0,
          bathrooms: parseInt(formData.specifications.bathrooms) || 0,
          area: parseInt(formData.specifications.area) || 0
        }
      };

      const response = await axios.post('/api/properties', propertyData);
      
      toast.success('Property added successfully!');
      navigate(`/property/${response.data.property._id}`);
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only landlords can add properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Add New Property</h1>
            <p className="text-blue-100 mt-2">List your property with AI-powered rent suggestions</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Luxury 2BHK Apartment in Bandra West"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnished Status
                  </label>
                  <select
                    name="specifications.furnished"
                    value={formData.specifications.furnished}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi">Semi Furnished</option>
                    <option value="fully">Fully Furnished</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your property, its features, and what makes it special..."
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    required
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 Hill Road, Bandra West"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    required
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 400050"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Square className="h-5 w-5 mr-2" />
                Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bed className="h-4 w-4 inline mr-1" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="specifications.bedrooms"
                    min="0"
                    value={formData.specifications.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bath className="h-4 w-4 inline mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="specifications.bathrooms"
                    min="0"
                    value={formData.specifications.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Square className="h-4 w-4 inline mr-1" />
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="specifications.area"
                    min="0"
                    value={formData.specifications.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing with AI Suggestion */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" />
                  Pricing
                </h2>
                <button
                  type="button"
                  onClick={getAiRentSuggestion}
                  disabled={aiAnalyzing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Brain className="h-4 w-4" />
                  <span>{aiAnalyzing ? 'Analyzing...' : 'Get AI Suggestion'}</span>
                </button>
              </div>

              {aiSuggestion && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Rent Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-700">Suggested Rent</p>
                      <p className="text-2xl font-bold text-purple-900">₹{aiSuggestion.suggested?.toLocaleString()}</p>
                      <p className="text-xs text-purple-600">Confidence: {aiSuggestion.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Market Average</p>
                      <p className="text-lg font-semibold text-purple-800">₹{aiSuggestion.marketComparison?.average?.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        rent: {
                          ...prev.rent,
                          monthly: aiSuggestion.suggested.toString(),
                          deposit: (aiSuggestion.suggested * 2).toString()
                        }
                      }));
                    }}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Use AI Suggestion
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    name="rent.monthly"
                    required
                    min="0"
                    value={formData.rent.monthly}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    name="rent.deposit"
                    required
                    min="0"
                    value={formData.rent.deposit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleArrayToggle(formData.amenities, amenity, 'amenities')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addCustomItem(newAmenity, 'amenities');
                    setNewAmenity('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {formData.amenities.filter(a => !commonAmenities.includes(a)).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.filter(a => !commonAmenities.includes(a)).map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeCustomItem(formData.amenities.indexOf(amenity), 'amenities')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Utilities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Utilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-green-700 mb-3">Included in Rent</h3>
                  <div className="space-y-2">
                    {commonUtilities.map(utility => (
                      <label key={utility} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.utilities.included.includes(utility)}
                          onChange={() => handleArrayToggle(formData.utilities.included, utility, 'utilities.included')}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{utility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-red-700 mb-3">Not Included</h3>
                  <div className="space-y-2">
                    {commonUtilities.map(utility => (
                      <label key={utility} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.utilities.excluded.includes(utility)}
                          onChange={() => handleArrayToggle(formData.utilities.excluded, utility, 'utilities.excluded')}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{utility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/landlord-dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProperty;