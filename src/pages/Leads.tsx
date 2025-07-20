import React from 'react';
import { Users, TrendingUp, Target, Clock, ArrowRight, Star, Zap, Shield } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Leads: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: 'Lead Management',
      description: 'Track and manage all your sales leads in one centralized dashboard'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: 'Conversion Analytics',
      description: 'Monitor your lead conversion rates and optimize your sales funnel'
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: 'Lead Scoring',
      description: 'Automatically score leads based on engagement and behavior patterns'
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: 'Follow-up Automation',
      description: 'Set up automated follow-up sequences to never miss a potential sale'
    }
  ];

  const benefits = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      text: 'Increase conversion rates by 40%'
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-500" />,
      text: 'Save 5+ hours per week on lead management'
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      text: 'Never lose track of potential customers'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-green-50 via-yellow-50 to-orange-50 rounded-3xl transform -rotate-1"></div>
          
          {/* Main content */}
          <div className="relative bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Local</span>
              <span className="text-orange-500">Zarurat</span>
              <span className="text-gray-700"> Lead Management</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your sales process with our powerful lead management system. 
              Track, nurture, and convert more leads than ever before.
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold mb-8">
              <Clock className="w-5 h-5 mr-2" />
              Coming Soon - Q2 2025
            </div>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Notified When Available
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Lead Management?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our comprehensive lead management system is designed to help you close more deals 
            and grow your business faster than ever before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              {benefit.icon}
              <span className="font-medium text-gray-900">{benefit.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl font-bold mb-2">40%</div>
          <div className="text-blue-100">Increase in Conversion Rate</div>
        </Card>
        
        <Card className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl font-bold mb-2">5+</div>
          <div className="text-green-100">Hours Saved Per Week</div>
        </Card>
        
        <Card className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl font-bold mb-2">100%</div>
          <div className="text-purple-100">Lead Tracking Accuracy</div>
        </Card>
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center p-12">
        <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Get early access to our lead management system and exclusive updates. 
          We'll notify you as soon as it's available.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Notify Me
          </Button>
        </div>
        
        <p className="text-gray-400 text-sm mt-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </Card>

      {/* Progress Indicator */}
      <Card className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Development Progress</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Backend API</span>
            <span className="text-sm text-green-600 font-semibold">Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Database Design</span>
            <span className="text-sm text-green-600 font-semibold">Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Frontend Development</span>
            <span className="text-sm text-blue-600 font-semibold">In Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Testing & QA</span>
            <span className="text-sm text-yellow-600 font-semibold">Pending</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
        
        <p className="text-gray-600 mt-6">
          Estimated launch: <span className="font-semibold text-gray-900">Q2 2025</span>
        </p>
      </Card>
    </div>
  );
};

export default Leads;