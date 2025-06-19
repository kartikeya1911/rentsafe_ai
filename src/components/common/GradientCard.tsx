import React from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  hover?: boolean;
}

const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  className = '', 
  gradient = 'from-blue-500 to-teal-500',
  hover = true
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-white shadow-lg ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GradientCard;