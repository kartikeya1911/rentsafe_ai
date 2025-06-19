import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Star,
  ArrowRight,
  Zap,
  Lock,
  FileCheck,
  Award,
  Globe,
  Smartphone,
  BarChart3,
  MessageSquare,
  Clock,
  DollarSign
} from 'lucide-react';
import AnimatedCounter from '../components/common/AnimatedCounter';
import FeatureCard from '../components/common/FeatureCard';
import TestimonialCard from '../components/common/TestimonialCard';
import GradientCard from '../components/common/GradientCard';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "All rental agreements are stored on blockchain for tamper-proof security and complete transparency.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI analyzes agreements for hidden clauses and suggests fair rent based on real market data.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CheckCircle,
      title: "Verified Reviews",
      description: "Only verified tenants and landlords can leave reviews, ensuring authentic and trustworthy feedback.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: FileCheck,
      title: "Smart Contracts",
      description: "Automated agreement execution with built-in payment tracking and intelligent notifications.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      title: "Trust Score System",
      description: "Dynamic trust scoring based on transaction history, reviews, and verification status.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Multi-City Coverage",
      description: "Available across major Indian cities with localized market insights and pricing data.",
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Fully responsive design that works seamlessly across all devices and screen sizes.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Real-time market trends, price comparisons, and investment insights for informed decisions.",
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    { number: 15000, label: "Properties Listed", suffix: "+" },
    { number: 8500, label: "Verified Users", suffix: "+" },
    { number: 98, label: "Success Rate", suffix: "%" },
    { number: 24, label: "AI Support", suffix: "/7" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer, Mumbai",
      content: "RentSafe AI helped me find the perfect apartment with complete transparency. The AI analysis saved me from a potentially unfair agreement!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Property Owner, Delhi",
      content: "As a landlord, I love how the platform verifies tenants and handles agreements securely. The blockchain storage gives me complete peace of mind.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Marketing Manager, Bangalore",
      content: "The trust score system and verified reviews made it so easy to choose the right property. Highly recommend to anyone looking for rentals!",
      rating: 5
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Browse & Connect",
      description: "Discover verified properties and connect with trusted landlords through our secure platform.",
      icon: Users
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our AI analyzes agreements for fairness, suggests optimal rent, and identifies potential risks.",
      icon: Brain
    },
    {
      step: "3",
      title: "Secure Agreement",
      description: "Sign digitally and store on blockchain for ultimate security and complete transparency.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-teal-100 px-4 py-2 rounded-full"
                >
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI + Blockchain Powered</span>
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Smart Rental
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                    Made Safe
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Experience the future of rental agreements with AI-powered analysis and blockchain security. 
                  <span className="block mt-2 font-semibold text-gray-800">
                    No more fraud, hidden clauses, or unfair deals.
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/properties"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                >
                  Browse Properties
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 font-medium">Blockchain Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">AI Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-teal-500" />
                  <span className="text-sm text-gray-600 font-medium">Verified Reviews</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <GradientCard className="p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">AI Property Analysis</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-medium">AI Verified</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-sm text-gray-700 font-medium">Fair Rent Analysis</span>
                      <span className="text-green-600 font-bold flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <span className="text-sm text-gray-700 font-medium">Agreement Safety</span>
                      <span className="text-blue-600 font-bold">95% Safe</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <span className="text-sm text-gray-700 font-medium">Blockchain Hash</span>
                      <span className="text-purple-600 font-mono text-xs">0x7a8f...</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-bold text-orange-700">
                        AI suggests ₹3,000 lower rent than listed
                      </span>
                    </div>
                  </div>
                </div>
              </GradientCard>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
              >
                <Lock className="h-6 w-6 text-blue-600" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
              >
                <Brain className="h-6 w-6 text-purple-600" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-6"
            >
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Why Choose RentSafe AI</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Advanced Technology Meets
              <span className="block bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Real Estate
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience the safest, smartest rental platform powered by cutting-edge AI and blockchain technology
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Simple, secure, and smart rental process in just three steps
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-teal-200 transform -translate-x-1/2" />
                )}
                
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl text-2xl font-bold mb-6 shadow-lg">
                  {step.step}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur-lg opacity-30 scale-110" />
                </div>
                
                <div className="mb-4">
                  <step.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Join thousands of satisfied users who trust RentSafe AI
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Ready to Experience
              <span className="block">Safe Rentals?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust RentSafe AI for their rental needs. 
              Start your journey to secure, transparent property deals today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link
                to="/register"
                className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/properties"
                className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center"
              >
                Explore Properties
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Setup in 2 minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Shield className="h-5 w-5" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;