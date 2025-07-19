import React from 'react';
import { X, CheckCircle, AlertCircle, Clock, Calendar, CreditCard, Crown } from 'lucide-react';
import { SubscriptionResponse } from '../../services/api';

interface SubscriptionResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: SubscriptionResponse | null;
  error: string | null;
  loading: boolean;
}

const SubscriptionResponseModal: React.FC<SubscriptionResponseModalProps> = ({ 
  isOpen, 
  onClose, 
  response, 
  error, 
  loading 
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Subscription Status</h2>
              <p className="text-sm text-gray-600">Your subscription details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your subscription...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Failed</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          ) : response ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Successful!</h3>
                <p className="text-gray-600">{response.message}</p>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900">Subscription Details</h4>
                
                {/* Plan Info */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">{response.subscription.planName}</span>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(response.subscription.amount)}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{response.subscription.duration} days</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(response.subscription.status)}`}>
                    {response.subscription.status.toUpperCase()}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(response.subscription.paymentStatus)}`}>
                    {response.subscription.paymentStatus.toUpperCase()}
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(response.subscription.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(response.subscription.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Your Plan Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Up to {response.subscription.features.maxProducts} products</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Up to {response.subscription.features.maxImages} images</span>
                  </div>
                  {response.subscription.features.prioritySupport && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Priority support</span>
                    </div>
                  )}
                  {response.subscription.features.featuredListing && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Featured listing</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionResponseModal; 