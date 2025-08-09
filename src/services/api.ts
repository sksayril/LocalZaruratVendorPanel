// API Base URL
// const API_BASE_URL = 'http://localhost:3110/api';
const API_BASE_URL = 'https://api.localzarurat.com/api';

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
    totalProducts: number;
    totalViews: number;
    walletBalance: number;
    pendingWithdrawals: number;
  };
  subscription: {
    razorpay: {
      orderId: string;
      paymentId: string;
    };
    features: {
      maxProducts: number;
      maxImages: number;
      featuredListing: boolean;
      prioritySupport: boolean;
      analytics: boolean;
    };
    _id: string;
    vendor: string;
    plan: string;
    amount: number;
    currency: string;
    status: string;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    paymentHistory: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    isActive: boolean;
    daysRemaining: number;
    id: string;
  };
  shopStatus: {
    isListed: boolean;
    hasActiveSubscription: boolean;
  };
  recentProducts: Array<{
    _id: string;
    name: string;
    price: {
      amount: number;
      currency: string;
      isNegotiable: boolean;
    };
    isActive: boolean;
    views: number;
    createdAt: string;
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
    _id?: string;
    vendor?: string;
    shopName: string;
    shopDescription: string;
    shopMetaTitle: string;
    shopMetaDescription: string;
    shopMetaKeywords: string[];
    shopMetaTags: string[];
    shopImages: string[];
    category?: {
      mainCategory: {
        _id: string;
        name: string;
        icon: string;
      };
      subCategory: {
        _id: string;
        name: string;
        image: string;
        thumbnail: string;
      };
    };
    address?: {
      pincode: string;
      addressLine1: string;
      addressLine2?: string;
      location: string;
      nearbyLocation?: string;
      coordinates?: Coordinates;
    };
    isListed: boolean;
    listedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  subscription?: {
    currentPlan: string;
    status: string;
    features: SubscriptionPlanFeatures;
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

export interface SubscriptionVerificationResponse {
  success: boolean;
  message: string;
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
      paymentId: string;
    };
  };
}

export interface SubscriptionDetailsResponse {
  currentSubscription?: {
    id: string;
    plan: string;
    planName: string;
    amount: number;
    status: 'active' | 'expired' | 'cancelled';
    startDate: string;
    endDate: string;
    remainingDays: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
    canRenew: boolean;
    features: SubscriptionPlanFeatures;
    razorpay: {
      orderId: string;
      paymentId: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  subscriptionStats: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    cancelledSubscriptions: number;
    totalAmountSpent: number;
  };
  subscriptionHistory: Array<{
    id: string;
    plan: string;
    planName: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    razorpay: {
      orderId: string;
      paymentId: string;
    };
  }>;
  availablePlans: {
    '3months': SubscriptionPlan;
    '6months': SubscriptionPlan;
    '1year': SubscriptionPlan;
  };
  renewalRecommendation?: {
    recommended: string;
    reason: string;
    savings: number;
  };
  shopStatus: {
    isListed: boolean;
    hasActiveSubscription: boolean;
  };
  nextRenewalDate?: string;
  daysUntilRenewal?: number;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  description: string;
  vendorCount: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  _id: string;
  name: string;
  image: string;
  thumbnail: string;
  description?: string;
  vendorCount?: number;
  features?: string[];
  popularTags?: string[];
}



export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResponse {
  results: Array<{
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
    components: {
      city?: string;
      state?: string;
      country?: string;
      postcode?: string;
    };
  }>;
  status: {
    code: number;
    message: string;
  };
}

export interface ShopListingFormData {
  shopName: string;
  shopDescription: string;
  shopMetaTitle: string;
  shopMetaDescription: string;
  shopMetaKeywords: string[];
  shopMetaTags: string[];
  mainCategory: string;
  subCategory: string;
  shopPincode: string;
  shopAddressLine1: string;
  shopAddressLine2?: string;
  shopLocation: string;
  nearbyLocation?: string;
  coordinates?: Coordinates;
  shopImages: File[];
}

export interface AddShopImagesResponse {
  addedImages: string[];
  totalImages: number;
  maxImagesAllowed: number;
  remainingSlots: number;
}

export interface ProductImage {
  url: string;
  isPrimary: boolean;
  alt: string;
  _id?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
  _id?: string;
}

export interface ProductPrice {
  amount: number;
  currency: string;
  isNegotiable: boolean;
}

export interface ProductStock {
  quantity: number;
  isInStock: boolean;
}

export interface ProductCategory {
  mainCategory: {
    _id: string;
    name: string;
    icon: string;
  };
  subCategory: {
    _id: string;
    name: string;
    image: string;
  };
}

export interface ProductContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: ProductPrice;
  specifications: ProductSpecification[];
  features: string[];
  tags: string[];
  stock: ProductStock;
  images: ProductImage[];
  metaTitle: string;
  metaDescription: string;
  availableInPincodes: string[];
  contactInfo: ProductContactInfo;
  vendor: string;
  views: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProductListItem {
  _id: string;
  vendor: string;
  name: string;
  description: string;
  category: ProductCategory;
  images: ProductImage[];
  price: {
    amount: number;
    currency: string;
    isNegotiable: boolean;
  };
  specifications: ProductSpecification[];
  features: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: ProductStock;
  metaTitle: string;
  metaDescription: string;
  views: number;
  availableInPincodes: string[];
  contactInfo: ProductContactInfo;
  favorites: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface ProductsResponse {
  data: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ProductsApiResponse {
  data: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreateProductResponse {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: ProductPrice;
  specifications: ProductSpecification[];
  features: string[];
  tags: string[];
  stock: ProductStock;
  images: ProductImage[];
  metaTitle: string;
  metaDescription: string;
  availableInPincodes: string[];
  contactInfo: ProductContactInfo;
  vendor: string;
  views: number;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProductResponse {
  _id: string;
  name: string;
  description: string;
  price: ProductPrice;
  stock: ProductStock;
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
      ...options.headers as Record<string, string>,
    };

    // Only set Content-Type for JSON requests, not for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

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
        
        // Handle token expiration (401 Unauthorized)
        if (response.status === 401) {
          console.log('Token expired or invalid, triggering logout...');
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirect to login page
          window.location.href = '/login';
          throw new Error('Authentication failed. Please login again.');
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('=== API Success Response ===');
      console.log('Response data:', data);
      return data;
    } catch (error: any) {
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
        razorpayKeyId: 'rzp_live_RAHu2hkLoA44nP'
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

  // Update Shop Listing API
  async updateShopListing(formData: FormData): Promise<ApiResponse<ShopListingResponse>> {
    const url = `${this.baseURL}/vendor/shop/listing/update`;
    
    console.log('=== Update Shop Listing API Call ===');
    console.log('Making shop listing update request to:', url);
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

      console.log('Shop listing update response status:', response.status);
      console.log('Shop listing update response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Shop Listing Update Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Shop Listing Update Response:', data);
      return data;
    } catch (error) {
      console.error('Shop listing update failed:', error);
      throw error;
    }
  }

  // Get coordinates from address using OpenCage Geocoding API
  async getCoordinatesFromAddress(address: string): Promise<Coordinates> {
    try {
      console.log('=== Geocoding API Call ===');
      console.log('Address:', address);
      
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=209d17df24024d31bdb7645501875d4c&language=en`
      );
      
      const data: GeocodingResponse = await response.json();
      console.log('Geocoding response:', data);
      
      if (data.status.code === 200 && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.lat,
          longitude: result.geometry.lng
        };
      } else {
        throw new Error('No coordinates found for this address');
      }
    } catch (error: any) {
      console.error('Failed to get coordinates:', error);
      throw error;
    }
  }

  // Get address from coordinates using OpenCage Reverse Geocoding API
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      console.log('=== Reverse Geocoding API Call ===');
      console.log('Coordinates:', { latitude, longitude });
      
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=209d17df24024d31bdb7645501875d4c&language=en`
      );
      
      const data: GeocodingResponse = await response.json();
      console.log('Reverse geocoding response:', data);
      
      if (data.status.code === 200 && data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        throw new Error('No address found for these coordinates');
      }
    } catch (error: any) {
      console.error('Failed to get address from coordinates:', error);
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

  // Verify Subscription Payment API
  async verifySubscriptionPayment(
    subscriptionId: string, 
    paymentId: string, 
    signature: string,
    orderId?: string
  ): Promise<ApiResponse<SubscriptionVerificationResponse>> {
    try {
      console.log('=== Verify Subscription Payment API Call ===');
      console.log('Verifying payment for subscription:', subscriptionId);
      console.log('Payment ID:', paymentId);
      console.log('Order ID:', orderId);
      console.log('Signature:', signature);
      
      const requestBody = {
        subscriptionId,
        paymentId,
        signature,
        orderId // Include order ID for proper signature verification
      };
      
      console.log('Verification request body:', requestBody);
      
      const response = await this.request<SubscriptionVerificationResponse>('/vendor/subscription/verify', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      
      console.log('Payment verification response:', response);
      return response;
    } catch (error) {
      console.error('Failed to verify subscription payment:', error);
      throw error;
    }
  }

  // Get Subscription Details API
  async getSubscriptionDetails(): Promise<ApiResponse<SubscriptionDetailsResponse>> {
    try {
      console.log('=== Get Subscription Details API Call ===');
      const response = await this.request<SubscriptionDetailsResponse>('/vendor/subscription/details');
      console.log('Subscription details response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch subscription details:', error);
      throw error;
    }
  }

  // Get Vendor Profile API
  async getVendorProfile(): Promise<ApiResponse<any>> {
    try {
      console.log('=== Get Vendor Profile API Call ===');
      const response = await this.request<any>('/vendor/profile');
      console.log('Vendor profile response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch vendor profile:', error);
      throw error;
    }
  }

  // Get Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      console.log('=== Get Categories API Call ===');
      const response = await this.request<Category[]>('/customer/categories');
      console.log('Categories response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  // Get Vendor Categories API (for product entry)
  async getVendorCategories(): Promise<ApiResponse<any[]>> {
    try {
      console.log('=== Get Vendor Categories API Call ===');
      const response = await this.request<any[]>('/vendor/categories/all');
      console.log('Vendor Categories response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch vendor categories:', error);
      throw error;
    }
  }

  // Get Referral Analytics API
  async getReferralAnalytics(): Promise<ApiResponse<any>> {
    try {
      console.log('=== Get Referral Analytics API Call ===');
      const response = await this.request<any>('/vendor/referral/analytics');
      console.log('Referral Analytics response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch referral analytics:', error);
      throw error;
    }
  }

  // Create Withdrawal Request API
  async createWithdrawalRequest(requestBody: any): Promise<ApiResponse<any>> {
    try {
      console.log('=== Create Withdrawal Request API Call ===');
      console.log('Withdrawal request body:', requestBody);
      const response = await this.request<any>('/vendor/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
      console.log('Withdrawal request response:', response);
      return response;
    } catch (error) {
      console.error('Failed to create withdrawal request:', error);
      throw error;
    }
  }

  // Get Sub Categories API
  async getSubCategories(mainCategoryId: string): Promise<ApiResponse<SubCategory[]>> {
    try {
      console.log('=== Get Sub Categories API Call ===');
      const response = await this.request<SubCategory[]>(`/customer/categories/${mainCategoryId}/subcategories`);
      console.log('Sub categories response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch sub categories:', error);
      throw error;
    }
  }

  // Add More Shop Images API
  async addShopImages(formData: FormData): Promise<ApiResponse<AddShopImagesResponse>> {
    try {
      console.log('Adding shop images...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await this.request<AddShopImagesResponse>('/vendor/shop/images', {
        method: 'POST',
        body: formData
      });

      console.log('Shop images added successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to add shop images:', error);
      throw error;
    }
  }

  // Product APIs
  async createProduct(formData: FormData): Promise<ApiResponse<CreateProductResponse>> {
    try {
      console.log('Creating product...');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await this.request<CreateProductResponse>('/vendor/products', {
        method: 'POST',
        body: formData
      });

      console.log('Product created successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  }

  async getProducts(page: number = 1, limit: number = 10): Promise<ApiResponse<ProductsApiResponse>> {
    try {
      console.log(`Fetching products - page: ${page}, limit: ${limit}`);
      
      const response = await this.request<ProductsApiResponse>(`/vendor/products?page=${page}&limit=${limit}`, {
        method: 'GET'
      });

      console.log('Products fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async getProduct(productId: string): Promise<ApiResponse<Product>> {
    try {
      console.log(`Fetching product details for ID: ${productId}`);
      
      const response = await this.request<Product>(`/vendor/products/${productId}`, {
        method: 'GET'
      });

      console.log('Product details fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    }
  }

  async updateProduct(productId: string, formData: FormData): Promise<ApiResponse<UpdateProductResponse>> {
    try {
      console.log(`Updating product with ID: ${productId}`);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await this.request<UpdateProductResponse>(`/vendor/products/${productId}`, {
        method: 'PUT',
        body: formData
      });

      console.log('Product updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log(`Deleting product with ID: ${productId}`);
      
      const response = await this.request<{ message: string }>(`/vendor/products/${productId}`, {
        method: 'DELETE'
      });

      console.log('Product deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to delete product:', error);
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(); 