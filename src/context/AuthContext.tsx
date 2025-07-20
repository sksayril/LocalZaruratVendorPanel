import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Import API service dynamically to avoid circular dependency
          const { apiService } = await import('../services/api');
          
          // Test if the token is still valid
          const isTokenValid = await apiService.testToken();
          
          if (isTokenValid) {
            // Token is valid, restore user state
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('Authentication restored from localStorage');
          } else {
            // Token is invalid, clear everything
            console.log('Stored token is invalid, clearing authentication');
            clearAuthData();
          }
        } else {
          console.log('No stored authentication data found');
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper function to clear all authentication data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('dashboardData');
    localStorage.removeItem('products');
    localStorage.removeItem('leads');
    localStorage.removeItem('wallets');
    localStorage.removeItem('profile');
    localStorage.removeItem('settings');
    localStorage.removeItem('notifications');
    localStorage.removeItem('subscription');
    localStorage.removeItem('kyc');
    localStorage.removeItem('shopImages');
    localStorage.removeItem('vendorDetails');
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Helper function to save user data to localStorage
  const saveUserToStorage = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    try {
      // Import API service dynamically to avoid circular dependency
      const { apiService } = await import('../services/api');
      
      // Call the real login API
      const response = await apiService.login(email, password);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Create user object from API response
      const loginUser: User = {
        id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
        company: response.data.user.vendorDetails?.gstNumber ? response.data.user.name : undefined,
        avatar: response.data.user.vendorDetails?.shopImages?.[0] || undefined
      };
      
      // Save user data to localStorage
      saveUserToStorage(loginUser);
      
      setUser(loginUser);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (formData: FormData) => {
    try {
      // Import API service dynamically to avoid circular dependency
      const { apiService } = await import('../services/api');
      
      // Call the real API
      const response = await apiService.vendorSignup(formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Create user object from API response
      const vendorUser: User = {
        id: response.data.vendor._id,
        name: response.data.vendor.name,
        email: response.data.vendor.email,
        phone: response.data.vendor.phone,
        company: response.data.vendor.name, // Using vendor name as company
        avatar: response.data.vendor.vendorDetails.shopImages[0] || undefined
      };
      
      // Save user data to localStorage
      saveUserToStorage(vendorUser);
      
      setUser(vendorUser);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    
    // Clear all authentication data
    clearAuthData();
    
    console.log('All authentication data cleared successfully');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Function to handle token expiration (called from API service)
  const handleTokenExpiration = () => {
    console.log('Token expired, logging out user...');
    clearAuthData();
    window.location.href = '/login';
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    handleTokenExpiration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};