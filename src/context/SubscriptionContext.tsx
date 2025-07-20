import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, SubscriptionDetailsResponse } from '../services/api';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscriptionDetails: SubscriptionDetailsResponse | null;
  loading: boolean;
  error: string | null;
  hasActiveSubscription: boolean;
  currentSubscription: SubscriptionDetailsResponse['currentSubscription'];
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchSubscriptionDetails = async () => {
    if (!isAuthenticated) {
      setSubscriptionDetails(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching subscription details...');
      const response = await apiService.getSubscriptionDetails();
      
      console.log('Subscription details received:', response.data);
      setSubscriptionDetails(response.data);
    } catch (err: any) {
      console.error('Failed to fetch subscription details:', err);
      setError(err.message || 'Failed to fetch subscription details');
      setSubscriptionDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscriptionDetails();
  };

  // Fetch subscription details when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionDetails();
    } else {
      setSubscriptionDetails(null);
      setError(null);
    }
  }, [isAuthenticated]);

  const hasActiveSubscription = subscriptionDetails?.currentSubscription?.status === 'active';
  const currentSubscription = subscriptionDetails?.currentSubscription;

  const value: SubscriptionContextType = {
    subscriptionDetails,
    loading,
    error,
    hasActiveSubscription,
    currentSubscription,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 