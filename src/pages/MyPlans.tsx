import React, { useState } from 'react';
import { Crown, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp, DollarSign, Package, Users, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton, { SkeletonCard, SkeletonGrid } from '../components/ui/Skeleton';
import { useSubscription } from '../context/SubscriptionContext';
import SubscriptionModal from '../components/modals/SubscriptionModal';

const MyPlans: React.FC = () => {
  const { subscriptionDetails, loading, error, hasActiveSubscription, refreshSubscription } = useSubscription();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

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
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'expired': return AlertTriangle;
      case 'cancelled': return Clock;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton variant="title" width="w-32" className="mb-2" />
            <Skeleton variant="text" width="w-80" />
          </div>
          <Skeleton variant="button" width="w-32" height="h-10" />
        </div>

        {/* Current Subscription Skeleton */}
        <SkeletonCard />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <div className="p-4 text-center">
                <Skeleton variant="avatar" className="w-8 h-8 mx-auto mb-2" />
                <Skeleton variant="title" width="w-20" className="mx-auto mb-1" />
                <Skeleton variant="text" width="w-16" className="mx-auto" />
              </div>
            </Card>
          ))}
        </div>

        {/* Available Plans Skeleton */}
        <Card>
          <div className="p-6">
            <Skeleton variant="title" width="w-40" className="mb-4" />
            <SkeletonGrid items={3} columns={3} />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Plans</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshSubscription} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Plans</h1>
            <p className="text-gray-600">Manage your subscription and view plan details</p>
          </div>
          {!hasActiveSubscription && (
            <Button onClick={() => setIsSubscriptionModalOpen(true)}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>

        {/* Current Subscription */}
        {hasActiveSubscription && subscriptionDetails?.currentSubscription && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {subscriptionDetails.currentSubscription.planName}
                    </h2>
                    <p className="text-gray-600">Active Subscription</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionDetails.currentSubscription.status)}`}>
                  {subscriptionDetails.currentSubscription.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(subscriptionDetails.currentSubscription.amount)}
                  </p>
                  <p className="text-sm text-gray-600">Plan Amount</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {subscriptionDetails.currentSubscription.remainingDays}
                  </p>
                  <p className="text-sm text-gray-600">Days Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(subscriptionDetails.currentSubscription.endDate)}
                  </p>
                  <p className="text-sm text-gray-600">Expires On</p>
                </div>
              </div>

              {/* Plan Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      Up to {subscriptionDetails.currentSubscription.features.maxProducts} products
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">
                      Up to {subscriptionDetails.currentSubscription.features.maxImages} images
                    </span>
                  </div>
                  {subscriptionDetails.currentSubscription.features.prioritySupport && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Priority support</span>
                    </div>
                  )}
                  {subscriptionDetails.currentSubscription.features.featuredListing && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Featured listing</span>
                    </div>
                  )}
                  {subscriptionDetails.currentSubscription.features.analytics && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Advanced analytics</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Stats */}
        {subscriptionDetails && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(subscriptionDetails.subscriptionStats.totalAmountSpent)}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptionDetails.subscriptionStats.totalSubscriptions}
                </p>
                <p className="text-sm text-gray-600">Total Plans</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptionDetails.subscriptionStats.activeSubscriptions}
                </p>
                <p className="text-sm text-gray-600">Active Plans</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptionDetails.subscriptionStats.expiredSubscriptions}
                </p>
                <p className="text-sm text-gray-600">Expired Plans</p>
              </div>
            </Card>
          </div>
        )}

        {/* Subscription History */}
        {subscriptionDetails?.subscriptionHistory && subscriptionDetails.subscriptionHistory.length > 0 && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription History</h3>
              <div className="space-y-4">
                {subscriptionDetails.subscriptionHistory.map((subscription) => {
                  const StatusIcon = getStatusIcon(subscription.status);
                  return (
                    <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{subscription.planName}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(subscription.amount)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                          {subscription.status.toUpperCase()}
                        </span>
                        <StatusIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}

        {/* Renewal Recommendation */}
        {subscriptionDetails?.renewalRecommendation && (
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Renewal Recommendation</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 mb-2">
                  <strong>Recommended:</strong> {subscriptionDetails.renewalRecommendation.recommended}
                </p>
                <p className="text-blue-800 text-sm mb-2">
                  {subscriptionDetails.renewalRecommendation.reason}
                </p>
                <p className="text-blue-700 text-sm">
                  <strong>Potential Savings:</strong> {formatCurrency(subscriptionDetails.renewalRecommendation.savings)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Available Plans */}
        {subscriptionDetails?.availablePlans && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(subscriptionDetails.availablePlans).map(([key, plan]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(plan.amount)}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{plan.duration} days</p>
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-700">Up to {plan.features.maxProducts} products</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-700">Up to {plan.features.maxImages} images</span>
                      </div>
                      {plan.features.prioritySupport && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-700">Priority support</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Choose Plan
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </>
  );
};

export default MyPlans; 