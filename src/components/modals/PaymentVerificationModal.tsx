import React, { useEffect } from 'react';
import { X, CheckCircle, Crown, Calendar, CreditCard, Shield, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { SubscriptionVerificationResponse } from '../../services/api';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationData: SubscriptionVerificationResponse | null;
  paymentDetails: {
    paymentId: string;
    orderId: string;
    amount: number;
    planName: string;
  } | null;
}

const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  verificationData,
  paymentDetails
}) => {
  // Show success toast when modal opens
  useEffect(() => {
    if (isOpen && verificationData && paymentDetails) {
      toast.success(
        `🎉 Subscription Activated! Your ${paymentDetails.planName} plan is now active.`,
        {
          duration: 6000,
          icon: '🎉',
        }
      );
    }
  }, [isOpen, verificationData, paymentDetails]);

  if (!isOpen || !verificationData || !paymentDetails) return null;

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
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      default: return status;
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
              <h2 className="text-xl font-bold text-gray-900">Payment Verified!</h2>
              <p className="text-sm text-gray-600">Your subscription has been activated successfully</p>
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
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Verified Successfully!
            </h3>
            <p className="text-gray-600">
              Your payment has been verified and your subscription is now active.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-green-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment Details</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700">Payment ID</p>
                <p className="font-mono text-sm font-medium text-green-900">{paymentDetails.paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Order ID</p>
                <p className="font-mono text-sm font-medium text-green-900">{paymentDetails.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Amount Paid</p>
                <p className="font-medium text-green-900">{formatCurrency(paymentDetails.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Plan</p>
                <p className="font-medium text-green-900">{paymentDetails.planName}</p>
              </div>
            </div>
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
                <p className="font-medium text-gray-900">{verificationData.subscription.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(verificationData.subscription.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verificationData.subscription.status)}`}>
                  {getStatusLabel(verificationData.subscription.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription ID</p>
                <p className="font-mono text-sm text-gray-900">{verificationData.subscription._id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Start Date</span>
                </p>
                <p className="font-medium text-gray-900">{formatDate(verificationData.subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>End Date</span>
                </p>
                <p className="font-medium text-gray-900">{formatDate(verificationData.subscription.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Your Plan Features</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-blue-800">
                  Up to {verificationData.subscription.features.maxProducts} products
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-blue-800">
                  Up to {verificationData.subscription.features.maxImages} images
                </span>
              </div>
              {verificationData.subscription.features.prioritySupport && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">Priority support</span>
                </div>
              )}
              {verificationData.subscription.features.featuredListing && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">Featured listing</span>
                </div>
              )}
              {verificationData.subscription.features.analytics && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">Advanced analytics</span>
                </div>
              )}
              {verificationData.subscription.features.apiAccess && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-800">API access</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>What's Next?</span>
            </h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• Your subscription is now active and ready to use</p>
              <p>• You can start adding products to your store</p>
              <p>• Access all premium features included in your plan</p>
              <p>• Contact support if you need any assistance</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationModal; 