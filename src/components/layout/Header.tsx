import React, { useState } from 'react';
import { Bell, User, LogOut, Crown, CheckCircle, Mail, Building, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import SubscriptionModal from '../modals/SubscriptionModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasActiveSubscription, currentSubscription, loading } = useSubscription();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleUpgradeClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-blue-600">Local</span>
                  <span className="text-orange-500">Zarurat</span>
                  <span className="text-gray-700"> Seller</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Subscription Status */}
            {!loading && (
              hasActiveSubscription ? (
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>{currentSubscription?.planName || 'Active Plan'}</span>
                </div>
              ) : (
                <button 
                  onClick={handleUpgradeClick}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Crown className="w-3 h-3" />
                  <span>Upgrade</span>
                </button>
              )
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block text-right">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{user?.company || 'Vendor'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              {/* Mobile User Info */}
              <div className="lg:hidden text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.company || 'Vendor'}</p>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </>
  );
};

export default Header;