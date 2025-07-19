import React from 'react';
import { X, CheckCircle, ExternalLink, Calendar, CreditCard, Crown } from 'lucide-react';
import { SubscriptionResponse } from '../../services/api';

interface SubscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData: SubscriptionResponse | null;
}

const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  subscriptionData 
}) => {
  if (!isOpen || !subscriptionData) return null;

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
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Payment Pending';
      case 'active': return 'Active';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const handlePaymentClick = () => {
    if (subscriptionData.razorpaySubscription.payment_link) {
      window.open(subscriptionData.razorpaySubscription.payment_link, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Subscription Created!</h2>
              <p className="text-sm text-gray-600">Your subscription has been successfully created</p>
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
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Subscription Created Successfully!
            </h3>
            <p className="text-gray-600">
              Your subscription is ready. Please complete the payment to activate your plan.
            </p>
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span>Subscription Details</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-medium text-gray-900">{subscriptionData.subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(subscriptionData.subscription.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscriptionData.subscription.status)}`}>
                  {getStatusLabel(subscriptionData.subscription.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription ID</p>
                <p className="font-mono text-sm text-gray-900">{subscriptionData.subscription._id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Start Date</span>
                </p>
                <p className="font-medium text-gray-900">{formatDate(subscriptionData.subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>End Date</span>
                </p>
                <p className="font-medium text-gray-900">{formatDate(subscriptionData.subscription.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-blue-800">
                  Up to {subscriptionData.subscription.features.maxProducts} products
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-blue-800">
                  Up to {subscriptionData.subscription.features.maxImages} images
                </span>
              </div>
              {subscriptionData.subscription.features.prioritySupport && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">Priority support</span>
                </div>
              )}
              {subscriptionData.subscription.features.featuredListing && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">Featured listing</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          {subscriptionData.subscription.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Complete Payment</span>
              </h4>
              <p className="text-sm text-yellow-800 mb-4">
                Your subscription is created but payment is pending. Click the button below to complete your payment.
              </p>
              <button
                onClick={handlePaymentClick}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Proceed to Payment</span>
              </button>
            </div>
          )}

          {/* Razorpay Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Razorpay Subscription ID:</span>
                <span className="font-mono text-sm text-gray-900">{subscriptionData.razorpaySubscription.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{subscriptionData.razorpaySubscription.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
          {subscriptionData.subscription.status === 'pending' && (
            <button
              onClick={handlePaymentClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Pay Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessModal; 