// Token Management Utilities

export const tokenManager = {
  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get user data from localStorage
  getUser: (): any => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Set user data in localStorage
  setUser: (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remove user data from localStorage
  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  // Clear all authentication data
  clearAuthData: (): void => {
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
  },

  // Check if user is authenticated (has both token and user data)
  isAuthenticated: (): boolean => {
    return !!(localStorage.getItem('token') && localStorage.getItem('user'));
  },

  // Test token validity by making a request to the API
  testTokenValidity: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      // Import API service dynamically to avoid circular dependency
      const { apiService } = await import('../services/api');
      
      // Test if the token is still valid
      const isTokenValid = await apiService.testToken();
      return isTokenValid;
    } catch (error) {
      console.error('Error testing token validity:', error);
      return false;
    }
  },

  // Initialize authentication state from localStorage
  initializeAuth: async (): Promise<{ isAuthenticated: boolean; user: any }> => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Test if the token is still valid
        const isTokenValid = await tokenManager.testTokenValidity();
        
        if (isTokenValid) {
          // Token is valid, return user data
          const parsedUser = JSON.parse(storedUser);
          return { isAuthenticated: true, user: parsedUser };
        } else {
          // Token is invalid, clear everything
          tokenManager.clearAuthData();
          return { isAuthenticated: false, user: null };
        }
      } else {
        // No stored authentication data
        return { isAuthenticated: false, user: null };
      }
    } catch (error) {
      console.error('Error initializing authentication:', error);
      tokenManager.clearAuthData();
      return { isAuthenticated: false, user: null };
    }
  }
};

export default tokenManager; 