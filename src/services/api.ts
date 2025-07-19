// API Base URL
const API_BASE_URL = 'https://7cvccltb-3110.inc1.devtunnels.ms/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface VendorSignupResponse {
  vendor: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    vendorDetails: {
      gstNumber: string;
      vendorAddress: {
        doorNumber: string;
        street: string;
        location: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
      mainCategory: string;
      subCategory: string;
      referralCode: string;
      shopImages: string[];
      kyc: {
        isVerified: boolean;
      };
      subscription: {
        hasActiveSubscription: boolean;
      };
      isShopListed: boolean;
    };
    createdAt: string;
  };
  token: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    vendorDetails?: {
      gstNumber: string;
      vendorAddress: {
        doorNumber: string;
        street: string;
        location: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
      mainCategory: string;
      subCategory: string;
      referralCode: string;
      shopImages: string[];
      kyc: {
        isVerified: boolean;
      };
      subscription: {
        hasActiveSubscription: boolean;
      };
      isShopListed: boolean;
    };
  };
  token: string;
}

export interface DashboardData {
  stats: {
    totalRevenue: number;
    activeProducts: number;
    newLeads: number;
    totalOrders: number;
    revenueChange: number;
    productsChange: number;
    leadsChange: number;
    ordersChange: number;
  };
  recentProducts: Array<{
    _id: string;
    name: string;
    price: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    views: number;
    createdAt: string;
  }>;
  recentLeads: Array<{
    _id: string;
    customerName: string;
    email: string;
    product: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    value: number;
    createdAt: string;
  }>;
  revenueData: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface SubscriptionPlanFeatures {
  maxProducts: number;
  maxImages: number;
  prioritySupport: boolean;
  featuredListing: boolean;
  analytics?: boolean;
  apiAccess?: boolean;
}

export interface SubscriptionPlan {
  name: string;
  amount: number;
  duration: number;
  features: SubscriptionPlanFeatures;
}

export interface SubscriptionPlansResponse {
  '3months': SubscriptionPlan;
  '6months': SubscriptionPlan;
  '1year': SubscriptionPlan;
}

export interface RazorpaySubscription {
  id: string;
  status: string;
  current_start: number;
  current_end: number;
  payment_link: string;
}

export interface SubscriptionResponse {
  subscription: {
    _id: string;
    vendor: string;
    plan: string;
    amount: number;
    status: 'pending' | 'active' | 'cancelled' | 'expired';
    startDate: string;
    endDate: string;
    features: SubscriptionPlanFeatures;
    razorpay: {
      subscriptionId: string;
      orderId: string;
    };
  };
  razorpaySubscription: RazorpaySubscription;
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface ShopListingResponse {
  shop: {
    _id: string;
    vendor: string;
    shopName: string;
    shopDescription: string;
    shopMetaTitle: string;
    shopMetaDescription: string;
    shopMetaKeywords: string[];
    shopMetaTags: string[];
    shopImages: string[];
    isListed: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PANCardUploadResponse {
  panNumber: string;
  panImage: string;
}

export interface AadharCardUploadResponse {
  aadharNumber: string;
  aadharFrontImage: string;
  aadharBackImage: string;
}

export interface KYCStatusResponse {
  status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  panCard?: {
    status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
    panNumber: string;
    panImage: string;
  };
  aadharCard?: {
    status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
    aadharNumber: string;
    aadharFrontImage: string;
    aadharBackImage: string;
  };
  message?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get token from localStorage
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Present' : 'Not found');
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 20) + '...');
    }
    return token;
  }

  // Generic request method with authentication
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const defaultOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      console.log('=== API Request Details ===');
      console.log('URL:', url);
      console.log('Method:', defaultOptions.method || 'GET');
      console.log('Headers:', headers);
      console.log('Token present:', !!token);
      
      const response = await fetch(url, defaultOptions);
      
      console.log('=== API Response Details ===');
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('=== API Error Details ===');
        console.error('Error response:', errorData);
        console.error('Full error object:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorData
        });
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('=== API Success Response ===');
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('=== API Request Failed ===');
      console.error('Error details:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  // Vendor Signup API
  async vendorSignup(formData: FormData): Promise<ApiResponse<VendorSignupResponse>> {
    const url = `${this.baseURL}/auth/vendor-signup`;
    
    console.log('Making vendor signup request to:', url);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData, browser will set it automatically
      });

      console.log('Signup response status:', response.status);
      console.log('Signup response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Signup Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Signup Response:', data);
      return data;
    } catch (error) {
      console.error('Vendor signup failed:', error);
      throw error;
    }
  }

  // Login API
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Dashboard API
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    console.log('=== Dashboard API Call ===');
    return this.request('/vendor/dashboard');
  }

  // Get Shop Listing API
  async getShopListing(): Promise<ApiResponse<ShopListingResponse>> {
    console.log('=== Get Shop Listing API Call ===');
    return this.request('/vendor/shop/listing');
  }

  // Subscription Plans API
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlansResponse>> {
    console.log('=== Subscription Plans API Call ===');
    return this.request('/vendor/subscription/plans');
  }

  // Create Subscription API
  async createSubscription(plan: string): Promise<ApiResponse<SubscriptionResponse>> {
    try {
      console.log('=== Create Subscription API Call ===');
      console.log('Creating subscription for plan:', plan);
      
      // Get token and verify it exists
      const token = this.getToken();
      console.log('Token for subscription:', token ? 'Present' : 'Missing');
      if (token) {
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');
      } else {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      // Include Razorpay key ID in the request
      const requestBody = {
        plan: plan,
        razorpayKeyId: 'rzp_test_BDT2TegS4Ax6Vp'
      };
      
      console.log('Request body with Razorpay key:', requestBody);
      
      // Make the request with explicit headers to ensure Bearer token is included
      const url = `${this.baseURL}/vendor/subscription`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      console.log('Making request to:', url);
      console.log('Request headers:', headers);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Subscription Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Subscription response:', data);
      return data;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  // Shop Listing API
  async createShopListing(formData: FormData): Promise<ApiResponse<ShopListingResponse>> {
    const url = `${this.baseURL}/vendor/shop/listing`;
    
    console.log('=== Shop Listing API Call ===');
    console.log('Making shop listing request to:', url);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    const token = this.getToken();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it automatically
        },
        body: formData,
      });

      console.log('Shop listing response status:', response.status);
      console.log('Shop listing response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Shop Listing Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Shop Listing Response:', data);
      return data;
    } catch (error) {
      console.error('Shop listing failed:', error);
      throw error;
    }
  }

  // Upload PAN Card
  async uploadPANCard(formData: FormData): Promise<ApiResponse<PANCardUploadResponse>> {
    try {
      console.log('Uploading PAN Card...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await fetch(`${this.baseURL}/vendor/kyc/pan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: formData,
      });

      console.log('PAN Card upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('PAN Card upload error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('PAN Card upload success:', data);
      return data;
    } catch (error) {
      console.error('PAN Card upload failed:', error);
      throw error;
    }
  }

  // Upload Aadhar Card
  async uploadAadharCard(formData: FormData): Promise<ApiResponse<AadharCardUploadResponse>> {
    try {
      console.log('Uploading Aadhar Card...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await fetch(`${this.baseURL}/vendor/kyc/aadhar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: formData,
      });

      console.log('Aadhar Card upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Aadhar Card upload error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Aadhar Card upload success:', data);
      return data;
    } catch (error) {
      console.error('Aadhar Card upload failed:', error);
      throw error;
    }
  }

  // Get KYC Status
  async getKYCStatus(): Promise<ApiResponse<KYCStatusResponse>> {
    try {
      console.log('=== Get KYC Status API Call ===');
      console.log('Fetching KYC status from:', `${this.baseURL}/vendor/kyc/status`);
      
      const response = await this.request<KYCStatusResponse>('/vendor/kyc/status');
      
      console.log('KYC Status Response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
      throw error;
    }
  }

  // Test token validity
  async testToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        console.log('No token found');
        return false;
      }

      console.log('Testing token validity...');
      const response = await this.request('/auth/verify-token');
      console.log('Token is valid:', response.success);
      return response.success;
    } catch (error) {
      console.log('Token is invalid:', error.message);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing connection to:', this.baseURL);
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Connection test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types
export type { 
  ApiResponse, 
  VendorSignupResponse, 
  LoginResponse, 
  DashboardData, 
  SubscriptionPlan, 
  SubscriptionPlansResponse, 
  SubscriptionPlanFeatures,
  SubscriptionResponse,
  RazorpaySubscription,
  ShopListingResponse,
  PANCardUploadResponse,
  AadharCardUploadResponse,
  KYCStatusResponse
}; 