import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, Eye, Loader2, AlertCircle, Wallet, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Skeleton, { SkeletonStats } from '../components/ui/Skeleton';
import { apiService, DashboardData } from '../services/api';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Dashboard Component ===');
      console.log('Starting to fetch dashboard data...');
      
      // First, test if we have a valid token
      const tokenValid = await apiService.testToken();
      if (!tokenValid) {
        throw new Error('Invalid or expired token. Please login again.');
      }
      
      console.log('Token is valid, proceeding with dashboard request...');
      const response = await apiService.getDashboard();
      
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('=== Dashboard Error ===');
      console.error('Failed to fetch dashboard data:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <Skeleton variant="title" width="w-64" className="mb-2" />
          <Skeleton variant="text" width="w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <SkeletonStats />

        {/* Charts and Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products Skeleton */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="title" width="w-32" />
              <Skeleton variant="button" width="w-16" height="h-6" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Skeleton variant="text" width="w-24" className="mb-1" />
                    <Skeleton variant="text" width="w-16" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Skeleton variant="text" width="w-12" />
                    <Skeleton variant="button" width="w-16" height="h-6" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Subscription Status Skeleton */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="title" width="w-32" />
              <Skeleton variant="button" width="w-16" height="h-6" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Skeleton variant="text" width="w-24" className="mb-1" />
                    <Skeleton variant="text" width="w-32" />
                  </div>
                  <div className="text-right">
                    <Skeleton variant="button" width="w-16" height="h-6" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
            >
              Retry
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Products',
      value: formatNumber(dashboardData.stats.totalProducts || 0),
      icon: Package,
      color: 'bg-blue-500',
      description: 'Active products in your shop'
    },
    {
      title: 'Total Views',
      value: formatNumber(dashboardData.stats.totalViews || 0),
      icon: Eye,
      color: 'bg-purple-500',
      description: 'Total product views'
    },
    {
      title: 'Wallet Balance',
      value: formatCurrency(dashboardData.stats.walletBalance || 0, 'INR'),
      icon: Wallet,
      color: 'bg-green-500',
      description: 'Available balance'
    },
    {
      title: 'Pending Withdrawals',
      value: formatCurrency(dashboardData.stats.pendingWithdrawals || 0, 'INR'),
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Awaiting approval'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-blue-600">Local</span>
          <span className="text-orange-500">Zarurat</span>
          <span className="text-gray-700"> Seller Dashboard</span>
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentProducts && dashboardData.recentProducts.length > 0 ? (
              dashboardData.recentProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(product.price.amount, product.price.currency)}
                      {product.price.isNegotiable && ' (Negotiable)'}
                    </p>
                    <p className="text-xs text-gray-500">Created: {formatDate(product.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(product.views)}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No products available yet
              </div>
            )}
          </div>
        </Card>

        {/* Subscription Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.subscription ? (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {dashboardData.subscription.plan.toUpperCase()} Plan
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    dashboardData.subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dashboardData.subscription.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(dashboardData.subscription.amount, dashboardData.subscription.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span className="font-medium">{dashboardData.subscription.daysRemaining} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Products:</span>
                    <span className="font-medium">{dashboardData.subscription.features.maxProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Images:</span>
                    <span className="font-medium">{dashboardData.subscription.features.maxImages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analytics:</span>
                    <span className="font-medium">{dashboardData.subscription.features.analytics ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {formatDate(dashboardData.subscription.startDate)}</span>
                    <span>End: {formatDate(dashboardData.subscription.endDate)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active subscription
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Shop Status */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shop Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Shop Listed</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dashboardData.shopStatus.isListed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {dashboardData.shopStatus.isListed ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active Subscription</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dashboardData.shopStatus.hasActiveSubscription 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {dashboardData.shopStatus.hasActiveSubscription ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;