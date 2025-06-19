import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  IndianRupee, 
  Shield,
  Brain,
  CheckCircle,
  AlertTriangle,
  User,
  Home,
  Clock
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
    street: string;
    city: string;
    state: string;
  };
  rent: {
    monthly: number;
    deposit: number;
  };
  landlord: {
    _id: string;
    name: string;
    email: string;
  };
}

const CreateAgreement: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [agreementTerms, setAgreementTerms] = useState({
    monthlyRent: '',
    securityDeposit: '',
    leaseDuration: '12',
    startDate: '',
    rentDueDate: '1',
    lateFee: '500',
    maintenanceResponsibility: 'tenant',
    utilitiesIncluded: [] as string[],
    specialClauses: [] as string[]
  });

  const [newClause, setNewClause] = useState('');

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  useEffect(() => {
    if (property) {
      setAgreementTerms(prev => ({
        ...prev,
        monthlyRent: property.rent.monthly.toString(),
        securityDeposit: property.rent.deposit.toString()
      }));
    }
  }, [property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/properties/${propertyId}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgreementTerms(prev => ({ ...prev, [name]: value }));
  };

  const handleUtilityToggle = (utility: string) => {
    setAgreementTerms(prev => ({
      ...prev,
      utilitiesIncluded: prev.utilitiesIncluded.includes(utility)
        ? prev.utilitiesIncluded.filter(u => u !== utility)
        : [...prev.utilitiesIncluded, utility]
    }));
  };

  const addSpecialClause = () => {
    if (newClause.trim()) {
      setAgreementTerms(prev => ({
        ...prev,
        specialClauses: [...prev.specialClauses, newClause.trim()]
      }));
      setNewClause('');
    }
  };

  const removeSpecialClause = (index: number) => {
    setAgreementTerms(prev => ({
      ...prev,
      specialClauses: prev.specialClauses.filter((_, i) => i !== index)
    }));
  };

  const analyzeAgreement = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/analyze-agreement', {
        clauses: [
          `Monthly rent: ₹${agreementTerms.monthlyRent}`,
          `Security deposit: ₹${agreementTerms.securityDeposit}`,
          `Lease duration: ${agreementTerms.leaseDuration} months`,
          `Late fee: ₹${agreementTerms.lateFee}`,
          `Maintenance responsibility: ${agreementTerms.maintenanceResponsibility}`,
          ...agreementTerms.specialClauses
        ]
      });
      
      setAiAnalysis(response.data.analysis);
      toast.success('AI analysis completed!');
    } catch (error) {
      console.error('Error analyzing agreement:', error);
      toast.error('Failed to analyze agreement');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property || user?.role !== 'tenant') {
      toast.error('Invalid request');
      return;
    }

    setSubmitting(true);
    try {
      const startDate = new Date(agreementTerms.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(agreementTerms.leaseDuration));

      const agreementData = {
        propertyId: property._id,
        terms: {
          ...agreementTerms,
          monthlyRent: parseInt(agreementTerms.monthlyRent),
          securityDeposit: parseInt(agreementTerms.securityDeposit),
          leaseDuration: parseInt(agreementTerms.leaseDuration),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          rentDueDate: parseInt(agreementTerms.rentDueDate),
          lateFee: parseInt(agreementTerms.lateFee)
        }
      };

      const response = await axios.post('/api/agreements', agreementData);
      
      toast.success('Agreement created successfully!');
      navigate(`/agreement/${response.data.agreement._id}`);
    } catch (error: any) {
      console.error('Error creating agreement:', error);
      toast.error(error.response?.data?.message || 'Failed to create agreement');
    } finally {
      setSubmitting(false);
    }
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
          <p className="text-gray-600">The property you're trying to create an agreement for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'tenant') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only tenants can create rental agreements.</p>
        </div>
      </div>
    );
  }

  const utilities = ['Water', 'Electricity', 'Gas', 'Internet', 'Cable TV', 'Maintenance'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Rental Agreement</h1>
            <p className="text-gray-600">Create a secure, blockchain-verified rental agreement</p>
          </div>

          {/* Property Info */}
          <GradientCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
                <p className="text-gray-600">{property.address.street}, {property.address.city}, {property.address.state}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600">Landlord: {property.landlord.name}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm font-medium text-green-600">₹{property.rent.monthly.toLocaleString()}/month</span>
                </div>
              </div>
            </div>
          </GradientCard>

          {/* Agreement Form */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Agreement Terms
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    name="monthlyRent"
                    required
                    value={agreementTerms.monthlyRent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    required
                    value={agreementTerms.securityDeposit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Duration (months) *
                  </label>
                  <select
                    name="leaseDuration"
                    required
                    value={agreementTerms.leaseDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={agreementTerms.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Due Date (day of month)
                  </label>
                  <select
                    name="rentDueDate"
                    value={agreementTerms.rentDueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Late Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="lateFee"
                    value={agreementTerms.lateFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Maintenance Responsibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Maintenance Responsibility
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="maintenanceResponsibility"
                      value="tenant"
                      checked={agreementTerms.maintenanceResponsibility === 'tenant'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Tenant</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="maintenanceResponsibility"
                      value="landlord"
                      checked={agreementTerms.maintenanceResponsibility === 'landlord'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Landlord</span>
                  </label>
                </div>
              </div>

              {/* Utilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Utilities Included in Rent
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {utilities.map(utility => (
                    <label key={utility} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={agreementTerms.utilitiesIncluded.includes(utility)}
                        onChange={() => handleUtilityToggle(utility)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{utility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Clauses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Special Clauses
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newClause}
                      onChange={(e) => setNewClause(e.target.value)}
                      placeholder="Add a special clause..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addSpecialClause}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {agreementTerms.specialClauses.length > 0 && (
                    <div className="space-y-2">
                      {agreementTerms.specialClauses.map((clause, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{clause}</span>
                          <button
                            type="button"
                            onClick={() => removeSpecialClause(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Agreement Analysis</h3>
                  <button
                    type="button"
                    onClick={analyzeAgreement}
                    disabled={analyzing}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Brain className="h-4 w-4" />
                    <span>{analyzing ? 'Analyzing...' : 'Analyze Agreement'}</span>
                  </button>
                </div>

                {aiAnalysis && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-3">Risk Assessment</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                aiAnalysis.riskScore < 30 ? 'bg-green-500' : 
                                aiAnalysis.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${aiAnalysis.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-purple-900">
                            {aiAnalysis.riskScore}/100
                          </span>
                        </div>
                        <p className="text-sm text-purple-700">
                          {aiAnalysis.riskScore < 30 ? 'Low Risk' : 
                           aiAnalysis.riskScore < 60 ? 'Medium Risk' : 'High Risk'}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-900 mb-3">Fairness Score</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${aiAnalysis.fairnessScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-purple-900">
                            {aiAnalysis.fairnessScore}/100
                          </span>
                        </div>
                        <p className="text-sm text-purple-700">Agreement Fairness</p>
                      </div>
                    </div>

                    {aiAnalysis.flaggedClauses && aiAnalysis.flaggedClauses.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Flagged Clauses</h4>
                        <div className="space-y-2">
                          {aiAnalysis.flaggedClauses.map((flag: any, index: number) => (
                            <div key={index} className="flex items-start space-x-2 p-2 bg-white rounded">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{flag.clause}</p>
                                <p className="text-xs text-gray-600">{flag.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-purple-900 mb-2">AI Suggestions</h4>
                        <ul className="space-y-1">
                          {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-sm text-gray-700">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/property/${property._id}`)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>{submitting ? 'Creating Agreement...' : 'Create Agreement'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAgreement;