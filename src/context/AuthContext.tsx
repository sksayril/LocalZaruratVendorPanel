import React, { createContext, useContext, useState, ReactNode } from 'react';
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
    
    // Clear everything from localStorage
    localStorage.clear();
    
    // Also remove specific items if they exist (for extra safety)
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
    
    // Clear sessionStorage as well (if any data is stored there)
    sessionStorage.clear();
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('All localStorage and sessionStorage cleared successfully');
    
    // Optional: Redirect to login page
    // window.location.href = '/login';
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};