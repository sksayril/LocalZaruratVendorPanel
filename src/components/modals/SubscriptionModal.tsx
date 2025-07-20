import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Loader2, AlertCircle, Star, ExternalLink, CreditCard } from 'lucide-react';
import { apiService, SubscriptionPlan, SubscriptionPlansResponse, SubscriptionVerificationResponse } from '../../services/api';
import { razorpayService, RazorpayResponse } from '../../services/razorpay';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import PaymentVerificationModal from './PaymentVerificationModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlanWithKey extends SubscriptionPlan {
  key: string;
  isPopular?: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [plans, setPlans] = useState<PlanWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationData, setVerificationData] = useState<SubscriptionVerificationResponse | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    planName: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionPlans();
    }
  }, [isOpen]);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching subscription plans...');
      const response = await apiService.getSubscriptionPlans();
      
      console.log('Subscription plans received:', response.data);
      
      // Transform the response data to array format
      const plansData: PlanWithKey[] = Object.entries(response.data).map(([key, plan]) => ({
        ...plan,
        key,
        isPopular: key === '1year' // Mark 1 year plan as popular
      }));
      
      console.log('Transformed plans data:', plansData);
      
      setPlans(plansData);
    } catch (error: any) {
      console.error('Failed to fetch subscription plans:', error);
      setError(error.message || 'Failed to load subscription plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDuration = (duration: number) => {
    if (duration === 90) return '3 months';
    if (duration === 180) return '6 months';
    if (duration === 365) return '1 year';
    return `${duration} days`;
  };

  const getDurationLabel = (key: string) => {
    switch (key) {
      case '3months': return '3 Months';
      case '6months': return '6 Months';
      case '1year': return '1 Year';
      default: return key;
    }
  };

  const handlePlanSelect = (planKey: string) => {
    setSelectedPlan(planKey);
  };

  const handleSubscribe = async (plan: PlanWithKey) => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        alert('Please log in to subscribe to a plan.');
        return;
      }

      // Debug: Check token status
      const token = localStorage.getItem('token');
      console.log('=== Authentication Debug ===');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user:', user);
      console.log('Token in localStorage:', token ? 'Present' : 'Missing');
      if (token) {
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');
      }

      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      console.log('User authentication status:', { isAuthenticated, user: !!user });
      console.log('User details:', user);

      setSubscribing(plan.key);
      console.log('Creating subscription for plan:', plan.key);
      console.log('Plan details:', plan);
      
      // Create subscription via API - this should return the Razorpay order ID
      const response = await apiService.createSubscription(plan.key);
      
      console.log('=== Backend Response Analysis ===');
      console.log('Full response data:', response.data);
      console.log('Subscription object:', response.data.subscription);
      console.log('Razorpay order:', response.data.razorpayOrder);
      console.log('Razorpay subscription:', response.data.razorpaySubscription);
      
      // Check what payment methods are available
      const hasRazorpayOrder = response.data.razorpayOrder?.id;
      const hasPaymentLink = response.data.razorpaySubscription?.payment_link;
      
      console.log('Has Razorpay order ID:', hasRazorpayOrder);
      console.log('Has payment link:', hasPaymentLink);
      
      if (hasRazorpayOrder && response.data.razorpayOrder) {
        console.log('Opening Razorpay modal with order ID from backend:', response.data.razorpayOrder.id);
        
        // Open Razorpay modal with the order ID from backend
        const paymentResponse: RazorpayResponse = await razorpayService.openPaymentModalWithOrder(
          response.data.razorpayOrder.id,
          plan.amount,
          'INR',
          plan.name,
          {
            name: user.name || 'Vendor User',
            email: user.email || 'vendor@example.com',
            contact: user.phone || '+919999999999'
          }
        );
        
        console.log('Payment completed successfully:', paymentResponse);
        
        // Call the backend verification API
        try {
          console.log('=== Calling Payment Verification API ===');
          console.log('Subscription ID:', response.data.subscription._id);
          console.log('Payment ID:', paymentResponse.razorpay_payment_id);
          console.log('Signature:', paymentResponse.razorpay_signature);
          
          const verificationResponse = await apiService.verifySubscriptionPayment(
            response.data.subscription._id,
            paymentResponse.razorpay_payment_id,
            paymentResponse.razorpay_signature,
            paymentResponse.razorpay_order_id
          );
          
          console.log('Payment verification successful:', verificationResponse);
          
          if (verificationResponse.success) {
            // Set verification data and payment details for the modal
            setVerificationData(verificationResponse.data);
            setPaymentDetails({
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              amount: plan.amount,
              planName: plan.name
            });
            
            // Refresh subscription details and close the subscription modal
            await refreshSubscription();
            onClose();
            setVerificationModalOpen(true);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } catch (verificationError: any) {
          console.error('Payment verification failed:', verificationError);
          
          // Show a more user-friendly error message
          const errorMessage = verificationError.message || 'Unknown verification error';
          alert(`Payment completed successfully, but verification failed.\n\nError: ${errorMessage}\n\nPlease contact support with:\n- Payment ID: ${paymentResponse.razorpay_payment_id}\n- Order ID: ${paymentResponse.razorpay_order_id}\n\nYour payment has been processed, but we need to verify it manually.`);
        }
        
      } else if (hasPaymentLink) {
        // If payment link is available, open it in new tab
        console.log('Opening payment link:', response.data.razorpaySubscription.payment_link);
        window.open(response.data.razorpaySubscription.payment_link, '_blank');
        
        alert(`Subscription created successfully! Payment link opened in new tab.\n\nPlan: ${plan.name}\nAmount: ${formatCurrency(plan.amount)}\nStatus: ${response.data.subscription.status}`);
      } else {
        // If no payment method is available, show subscription created message
        console.log('No payment method available, subscription created without payment');
        alert(`Subscription created successfully!\n\nPlan: ${plan.name}\nAmount: ${formatCurrency(plan.amount)}\nStatus: ${response.data.subscription.status}\n\nPlease contact support for payment instructions.`);
      }
      
      // Close modal after successful subscription
      onClose();
      
    } catch (error: any) {
      console.error('Failed to create subscription:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('already have an active or pending subscription')) {
        alert('You already have an active or pending subscription. Please wait for your current subscription to expire or contact support to upgrade.');
        onClose(); // Close the modal since they can't subscribe
        return;
      }
      
      // Provide more detailed error information for other errors
      let errorMessage = 'Failed to create subscription';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      if (error.response?.data?.message) {
        errorMessage += `\nServer message: ${error.response.data.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setSubscribing(null);
    }
  };

  const getFeaturesList = (plan: PlanWithKey) => {
    const features = [];
    
    if (plan.features.maxProducts) {
      features.push(`Up to ${plan.features.maxProducts} products`);
    }
    if (plan.features.maxImages) {
      features.push(`Up to ${plan.features.maxImages} images`);
    }
    if (plan.features.prioritySupport) {
      features.push('Priority support');
    }
    if (plan.features.featuredListing) {
      features.push('Featured listing');
    }
    if (plan.features.analytics) {
      features.push('Advanced analytics');
    }
    if (plan.features.apiAccess) {
      features.push('API access');
    }
    
    return features;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* Debug button to check auth status */}
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                console.log('=== Auth Status Check ===');
                console.log('isAuthenticated:', isAuthenticated);
                console.log('user:', user);
                console.log('Token present:', !!token);
                if (token) {
                  console.log('Token length:', token.length);
                  console.log('Token preview:', token.substring(0, 20) + '...');
                }
                alert(`Auth Status:\n- isAuthenticated: ${isAuthenticated}\n- User: ${user ? 'Present' : 'Missing'}\n- Token: ${token ? 'Present' : 'Missing'}`);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              title="Check authentication status"
            >
              Debug Auth
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading plans...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <span className="ml-3 text-red-600">{error}</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative border rounded-lg p-6 transition-all duration-200 ${
                    plan.isPopular
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getDurationLabel(plan.key)}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatCurrency(plan.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {formatDuration(plan.duration)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {getFeaturesList(plan).map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing === plan.key}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      plan.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {subscribing === plan.key ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscribe Now
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Verification Modal */}
      <PaymentVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        verificationData={verificationData}
        paymentDetails={paymentDetails}
      />
    </div>
  );
};

export default SubscriptionModal;