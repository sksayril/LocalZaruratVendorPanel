import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Users, DollarSign, ShoppingCart, Eye, Loader2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getChangeType = (change: number | undefined) => {
    if (change === undefined || change === null) return 'neutral';
    return change >= 0 ? 'positive' : 'negative';
  };

  const formatChange = (change: number | undefined) => {
    // Handle undefined, null, or NaN values
    if (change === undefined || change === null || isNaN(change)) {
      return '0.0%';
    }
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
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
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.stats.totalRevenue || 0),
      change: formatChange(dashboardData.stats.revenueChange),
      changeType: getChangeType(dashboardData.stats.revenueChange),
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Products',
      value: formatNumber(dashboardData.stats.activeProducts || 0),
      change: formatChange(dashboardData.stats.productsChange),
      changeType: getChangeType(dashboardData.stats.productsChange),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'New Leads',
      value: formatNumber(dashboardData.stats.newLeads || 0),
      change: formatChange(dashboardData.stats.leadsChange),
      changeType: getChangeType(dashboardData.stats.leadsChange),
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Orders',
      value: formatNumber(dashboardData.stats.totalOrders || 0),
      change: formatChange(dashboardData.stats.ordersChange),
      changeType: getChangeType(dashboardData.stats.ordersChange),
      icon: ShoppingCart,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
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
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change} from last month
                  </p>
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
            {dashboardData.recentProducts?.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{formatCurrency(product.price || 0)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(product.views || 0)}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : product.status === 'out_of_stock'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                No recent products available
              </div>
            )}
          </div>
        </Card>

        {/* Recent Leads */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentLeads?.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{lead.customerName}</h4>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  <p className="text-xs text-gray-500">{lead.product}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                    lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lead.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(lead.value || 0)}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                No recent leads available
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Revenue chart will be displayed here</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;