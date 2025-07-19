import React, { useState } from 'react';
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, Search, Download, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Transaction } from '../types';

const Wallets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const walletBalance = 2847.95;
  const pendingBalance = 324.50;
  const totalEarnings = 12845.75;

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 99.99,
      description: 'Payment for Wireless Bluetooth Headphones - Order #12345',
      date: '2025-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'credit',
      amount: 199.99,
      description: 'Payment for Smart Fitness Watch - Order #12346',
      date: '2025-01-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'debit',
      amount: 25.50,
      description: 'Platform fee for January',
      date: '2025-01-14T09:20:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'credit',
      amount: 49.99,
      description: 'Payment for Ergonomic Laptop Stand - Order #12347',
      date: '2025-01-13T14:15:00Z',
      status: 'pending'
    },
    {
      id: '5',
      type: 'debit',
      amount: 15.00,
      description: 'Withdrawal to bank account',
      date: '2025-01-12T11:30:00Z',
      status: 'completed'
    },
    {
      id: '6',
      type: 'credit',
      amount: 29.99,
      description: 'Payment for Wireless Mouse - Order #12348',
      date: '2025-01-11T16:45:00Z',
      status: 'completed'
    },
    {
      id: '7',
      type: 'credit',
      amount: 34.99,
      description: 'Payment for Desk Organizer Set - Order #12349',
      date: '2025-01-10T13:20:00Z',
      status: 'failed'
    },
    {
      id: '8',
      type: 'debit',
      amount: 8.75,
      description: 'Transaction fee',
      date: '2025-01-09T10:15:00Z',
      status: 'completed'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
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
          <Button>
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
              <p className="text-3xl font-bold text-gray-900">${walletBalance.toLocaleString()}</p>
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
              <p className="text-sm font-medium text-gray-600">Pending Balance</p>
              <p className="text-3xl font-bold text-gray-900">${pendingBalance.toLocaleString()}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="justify-start" variant="outline">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
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
    </div>
  );
};

export default Wallets;