import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  Heart,
  Star,
  Eye,
  Shield,
  Wifi,
  Car,
  Zap,
  Camera,
  Share2
} from 'lucide-react';

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

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images.length > 0 ? property.images : [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const amenityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'parking': Car,
    'power_backup': Zap,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`${property.title} - ${idx + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg">
            {property.propertyType}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-lg backdrop-blur-sm"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
          <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-all shadow-lg backdrop-blur-sm">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Camera className="h-3 w-3 text-gray-600" />
            <span className="text-xs text-gray-600">{images.length}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              ₹{property.rent.monthly.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
          <span>{property.address.city}, {property.address.state}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          {property.specifications.bedrooms > 0 && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
              <Bed className="h-4 w-4 mr-1 text-blue-500" />
              <span>{property.specifications.bedrooms} bed</span>
            </div>
          )}
          {property.specifications.bathrooms > 0 && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
              <Bath className="h-4 w-4 mr-1 text-blue-500" />
              <span>{property.specifications.bathrooms} bath</span>
            </div>
          )}
          {property.specifications.area > 0 && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
              <Square className="h-4 w-4 mr-1 text-blue-500" />
              <span>{property.specifications.area} sq ft</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity, idx) => {
              const IconComponent = amenityIcons[amenity.toLowerCase()] || Zap;
              return (
                <div key={idx} className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs">
                  <IconComponent className="h-3 w-3 mr-1" />
                  <span className="capitalize">{amenity.replace('_', ' ')}</span>
                </div>
              );
            })}
            {property.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{property.amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* Landlord Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
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
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-900">{property.landlord.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">
                    {property.landlord.rating?.average?.toFixed(1) || 'New'} 
                    {property.landlord.rating?.count > 0 && ` (${property.landlord.rating.count})`}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{property.views}</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to={`/property/${property._id}`}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default PropertyCard;