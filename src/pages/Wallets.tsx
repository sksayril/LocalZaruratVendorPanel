import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, Search, Download, Plus, Users, DollarSign, Calendar, AlertCircle, Copy, Share2, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton, { SkeletonStats } from '../components/ui/Skeleton';
import Input from '../components/ui/Input';
import { Transaction } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Wallets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi');
  const [copied, setCopied] = useState(false);

  // UPI Details
  const [upiId, setUpiId] = useState('');

  // Bank Details
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });

  // API Data
  const [walletData, setWalletData] = useState<any>(null);
  const [referralData, setReferralData] = useState<any>(null);

  // Fetch referral analytics data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getReferralAnalytics();
        setReferralData(response.data);
        setWalletData(response.data.wallet);
      } catch (err) {
        console.error('Failed to fetch referral analytics:', err);
        toast.error('Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  // Handle copy referral code
  const handleCopyReferralCode = async () => {
    const referralCode = referralData?.vendorInfo?.referralCode;
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopied(true);
        toast.success('Referral code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = referralCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success('Referral code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Handle share referral code
  const handleShareReferralCode = async () => {
    const referralCode = referralData?.vendorInfo?.referralCode;
    const vendorName = referralData?.vendorInfo?.name || 'Vendor';
    
    if (referralCode) {
      const shareText = `Join ${vendorName} on Local Zarurat! Use my referral code: ${referralCode}`;
      const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join Local Zarurat',
            text: shareText,
            url: shareUrl
          });
        } catch (err) {
          // Fallback to clipboard
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          toast.success('Share text copied to clipboard!');
        }
      } else {
        // Fallback for browsers without share API
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success('Share text copied to clipboard!');
      }
    }
  };

  // Validate withdrawal form
  const validateWithdrawalForm = () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount > (walletData?.balance || 0)) {
      toast.error('Insufficient balance');
      return false;
    }

    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        toast.error('Please enter your UPI ID');
        return false;
      }
      // Basic UPI ID validation
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
      if (!upiRegex.test(upiId)) {
        toast.error('Please enter a valid UPI ID (e.g., john@paytm)');
        return false;
      }
    } else if (paymentMethod === 'bank') {
      if (!bankDetails.accountNumber.trim()) {
        toast.error('Please enter account number');
        return false;
      }
      if (!bankDetails.ifscCode.trim()) {
        toast.error('Please enter IFSC code');
        return false;
      }
      if (!bankDetails.accountHolderName.trim()) {
        toast.error('Please enter account holder name');
        return false;
      }
      if (!bankDetails.bankName.trim()) {
        toast.error('Please enter bank name');
        return false;
      }
      // Basic IFSC validation
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(bankDetails.ifscCode.toUpperCase())) {
        toast.error('Please enter a valid IFSC code');
        return false;
      }
    }

    return true;
  };

  // Handle withdrawal request
  const handleWithdrawal = async () => {
    if (!validateWithdrawalForm()) {
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    let requestBody: any;

    if (paymentMethod === 'upi') {
      requestBody = {
        amount: amount,
        paymentMethod: 'upi',
        upiId: upiId.trim()
      };
    } else {
      requestBody = {
        amount: amount,
        paymentMethod: 'bank',
        bankDetails: {
          accountNumber: bankDetails.accountNumber.trim(),
          ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
          accountHolderName: bankDetails.accountHolderName.trim(),
          bankName: bankDetails.bankName.trim()
        }
      };
    }

    try {
      setWithdrawalLoading(true);
      await apiService.createWithdrawalRequest(requestBody);
      toast.success('Withdrawal request submitted successfully');
      setShowWithdrawalModal(false);
      resetWithdrawalForm();
      
      // Refresh data
      const response = await apiService.getReferralAnalytics();
      setReferralData(response.data);
      setWalletData(response.data.wallet);
    } catch (err: any) {
      console.error('Failed to create withdrawal request:', err);
      toast.error(err.message || 'Failed to submit withdrawal request');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Reset withdrawal form
  const resetWithdrawalForm = () => {
    setWithdrawalAmount('');
    setPaymentMethod('upi');
    setUpiId('');
    setBankDetails({
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    });
  };

  // Close withdrawal modal
  const closeWithdrawalModal = () => {
    setShowWithdrawalModal(false);
    resetWithdrawalForm();
  };

  // Transform API data to transaction format
  const getTransactions = () => {
    const transactions: Transaction[] = [];
    
    // Add recent commissions
    if (referralData?.recentCommissions) {
      referralData.recentCommissions.forEach((commission: any) => {
        transactions.push({
          id: commission._id,
          type: 'credit',
          amount: commission.commission.amount,
          description: `Commission from ${commission.referredVendor.name} - ${commission.subscription.plan} subscription`,
          date: commission.createdAt,
          status: commission.status === 'paid' ? 'completed' : commission.status
        });
      });
    }
    
    // Add withdrawal requests
    if (walletData?.withdrawalRequests) {
      walletData.withdrawalRequests.forEach((withdrawal: any) => {
        transactions.push({
          id: withdrawal._id,
          type: 'debit',
          amount: withdrawal.amount,
          description: `Withdrawal request to ${withdrawal.paymentMethod === 'upi' ? 'UPI' : 'Bank Account'}`,
          date: withdrawal.requestDate,
          status: withdrawal.status === 'approved' ? 'completed' : withdrawal.status
        });
      });
    }
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const transactions = getTransactions();
  
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const statusMap = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="flex gap-3">
            <Skeleton variant="button" width="w-24" height="h-10" />
            <Skeleton variant="button" width="w-24" height="h-10" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <SkeletonStats />

        {/* Filters Skeleton */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton variant="button" width="w-full sm:w-64" height="h-10" />
            <Skeleton variant="button" width="w-32" height="h-10" />
          </div>
        </Card>

        {/* Transactions Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton variant="avatar" className="w-10 h-10" />
                  <div>
                    <Skeleton variant="text" width="w-24" className="mb-1" />
                    <Skeleton variant="text" width="w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton variant="text" width="w-20" className="mb-1" />
                  <Skeleton variant="text" width="w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallets</h1>
          <p className="text-gray-600">Manage your earnings and financial transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowWithdrawalModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{walletData?.balance?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">Ready for withdrawal</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Commissions</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{referralData?.commissionStats?.pendingAmount?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Processing payments</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{referralData?.commissionStats?.totalEarned?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-blue-600 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Code Section */}
      {referralData?.vendorInfo?.referralCode && (
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Referral Code</h3>
              <p className="text-gray-600 mb-4">
                Share this code with other vendors to earn commissions when they subscribe
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1 max-w-xs">
                  <div className="relative">
                    <Input
                      type="text"
                      value={referralData.vendorInfo.referralCode}
                      readOnly
                      className="pr-20 bg-gray-50 font-mono text-lg font-bold text-center"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        onClick={handleCopyReferralCode}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy referral code"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleShareReferralCode}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">
                  {referralData.referralStats?.totalReferrals || 0}
                </div>
                <div className="text-sm opacity-90">Total Referrals</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Referral Statistics */}
      {referralData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData.referralStats?.totalReferrals || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData.referralStats?.activeSubscriptions || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData.referralStats?.subscriptionConversionRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData.commissionStats?.totalCommissions || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Referred Vendors Section */}
      {referralData?.referredVendors && referralData.referredVendors.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Referred Vendors</h3>
            <span className="text-sm text-gray-500">
              {referralData.referredVendors.length} vendors
            </span>
          </div>
          
          <div className="space-y-3">
            {referralData.referredVendors.slice(0, 5).map((vendor: any) => (
              <div key={vendor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {vendor.name?.charAt(0)?.toUpperCase() || 'V'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-500">{vendor.shopName}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    vendor.subscription?.isActive ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {vendor.subscription?.isActive ? 'Active' : 'No Subscription'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(vendor.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {referralData.referredVendors.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All ({referralData.referredVendors.length})
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Commission Breakdown */}
      {referralData?.commissionStats?.commissionByPlan && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown by Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {referralData.commissionStats.commissionByPlan.map((plan: any) => (
              <div key={plan._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {plan._id} Plan
                  </h4>
                  <span className="text-sm text-gray-500">
                    {plan.count} referrals
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Earned:</span>
                    <span className="font-medium">₹{plan.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-medium text-green-600">₹{plan.paidAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-yellow-600">
                      ₹{plan.totalAmount - plan.paidAmount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="justify-start" 
            variant="outline"
            onClick={() => setShowWithdrawalModal(true)}
          >
            <ArrowDownLeft className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Withdraw Funds</div>
              <div className="text-sm text-gray-500">Transfer to bank account</div>
            </div>
          </Button>
          <Button className="justify-start" variant="outline">
            <Download className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Download Report</div>
              <div className="text-sm text-gray-500">Export transaction history</div>
            </div>
          </Button>
          <Button className="justify-start" variant="outline">
            <CreditCard className="w-4 h-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Payment Settings</div>
              <div className="text-sm text-gray-500">Manage payment methods</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Transaction Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card padding={false}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {transaction.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                    {transaction.type === 'credit' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Referral commission earned
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTransactions.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Your transaction history will appear here'}
            </p>
          </div>
        </Card>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
              <button
                onClick={closeWithdrawalModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Available Balance */}
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance
                </label>
                <div className="text-2xl font-bold text-green-600">
                  ₹{walletData?.balance?.toLocaleString() || '0'}
                </div>
              </div>

              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  max={walletData?.balance || 0}
                  min="1"
                />
                {withdrawalAmount && parseFloat(withdrawalAmount) > (walletData?.balance || 0) && (
                  <p className="text-red-500 text-sm mt-1">Amount exceeds available balance</p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'bank')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">UPI Transfer</div>
                      <div className="text-sm text-gray-500">Instant transfer to UPI ID</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'bank')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Bank Transfer</div>
                      <div className="text-sm text-gray-500">Transfer to bank account (2-3 days)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* UPI Details */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., john@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your UPI ID (e.g., phone@paytm, email@okicici)
                  </p>
                </div>
              )}

              {/* Bank Details */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter account number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., SBIN0001234"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter account holder name"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., State Bank of India"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Information Note */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">Processing Time</p>
                    <p className="text-sm text-blue-600">
                      {paymentMethod === 'upi' 
                        ? 'UPI transfers are processed instantly within 24 hours.'
                        : 'Bank transfers are processed within 2-3 business days.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={closeWithdrawalModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawal}
                loading={withdrawalLoading}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > (walletData?.balance || 0)}
              >
                {withdrawalLoading ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;