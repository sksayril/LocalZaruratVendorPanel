import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Shield, 
  CreditCard, 
  Star, 
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Lock,
  Globe,
  Home,
  Briefcase,
  Heart,
  Zap,
  Sparkles,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton, { SkeletonForm } from '../components/ui/Skeleton';
import Input from '../components/ui/Input';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface SecurityQuestions {
  question1: SecurityQuestion;
  question2: SecurityQuestion;
}

interface ShopAddress {
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  location: string;
  nearbyLocation: string;
}

interface VendorAddress {
  doorNumber: string;
  street: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface SubscriptionFeatures {
  maxProducts: number;
  maxImages: number;
  prioritySupport: boolean;
  featuredListing: boolean;
}

interface Subscription {
  features: SubscriptionFeatures;
  status: string;
  amount: number;
  currentPlan: string;
  endDate: string;
  startDate: string;
  isActive: boolean;
  razorpayPaymentId: string;
}

interface Wallet {
  balance: number;
  transactions: any[];
}

interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface VendorDetails {
  shopAddress: ShopAddress;
  vendorAddress: VendorAddress;
  kyc: {
    isVerified: boolean;
  };
  subscription: Subscription;
  wallet: Wallet;
  ratingDistribution: RatingDistribution;
  shopImages: string[];
  gstNumber: string;
  mainCategory: string;
  subCategory: string;
  shopMetaKeywords: string[];
  shopMetaTags: string[];
  isShopListed: boolean;
  withdrawalRequests: any[];
  averageRating: number;
  totalRatings: number;
  referralCode: string;
  shopDescription: string;
  shopListedAt: string;
  shopMetaDescription: string;
  shopMetaTitle: string;
  shopName: string;
}

interface UserData {
  address: Address;
  securityQuestions: SecurityQuestions;
  vendorDetails: VendorDetails;
  customerDetails: {
    preferences: {
      categories: string[];
    };
    favorites: any[];
  };
  adminDetails: {
    permissions: string[];
    isSuperAdmin: boolean;
    accessLevel: string;
    lastLogin: string;
  };
  _id: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileImage: string | null;
  loginAttempts: number;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    bio: '',
    website: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setDataLoading(true);
      setError(null);
      
      console.log('Fetching vendor profile details...');
      const response = await apiService.getVendorProfile();
      
      console.log('Vendor profile response:', response);
      
      if (response.success && response.data) {
        const profileData = response.data;
        
        // Transform API data to match our interface
        const transformedData: UserData = {
          address: {
            street: profileData.vendorDetails?.vendorAddress?.street || '',
            city: profileData.vendorDetails?.vendorAddress?.city || '',
            state: profileData.vendorDetails?.vendorAddress?.state || '',
            pincode: profileData.vendorDetails?.vendorAddress?.pincode || '',
            country: profileData.vendorDetails?.vendorAddress?.country || ''
          },
          securityQuestions: {
            question1: {
              question: "What was your first pet's name?",
              answer: "••••••••••"
            },
            question2: {
              question: "In which city were you born?",
              answer: "••••••••••"
            }
          },
          vendorDetails: {
            shopAddress: profileData.vendorDetails?.shopAddress || {
              pincode: '',
              addressLine1: '',
              addressLine2: '',
              location: '',
              nearbyLocation: ''
            },
            vendorAddress: profileData.vendorDetails?.vendorAddress || {
              doorNumber: '',
              street: '',
              location: '',
              city: '',
              state: '',
              pincode: '',
              country: ''
            },
            kyc: profileData.vendorDetails?.kyc || { isVerified: false },
            subscription: profileData.vendorDetails?.subscription || {
              features: {
                maxProducts: 0,
                maxImages: 0,
                prioritySupport: false,
                featuredListing: false
              },
              status: 'inactive',
              amount: 0,
              currentPlan: '',
              endDate: '',
              startDate: '',
              isActive: false,
              razorpayPaymentId: ''
            },
            wallet: profileData.vendorDetails?.wallet || {
              balance: 0,
              transactions: []
            },
            ratingDistribution: profileData.vendorDetails?.ratingDistribution || {
              "1": 0,
              "2": 0,
              "3": 0,
              "4": 0,
              "5": 0
            },
            shopImages: profileData.vendorDetails?.shopImages || [],
            gstNumber: profileData.vendorDetails?.gstNumber || '',
            mainCategory: profileData.vendorDetails?.mainCategory?._id || '',
            subCategory: profileData.vendorDetails?.subCategory?._id || '',
            shopMetaKeywords: profileData.vendorDetails?.shopMetaKeywords || [],
            shopMetaTags: profileData.vendorDetails?.shopMetaTags || [],
            isShopListed: profileData.vendorDetails?.isShopListed || false,
            withdrawalRequests: profileData.vendorDetails?.withdrawalRequests || [],
            averageRating: profileData.vendorDetails?.averageRating || 0,
            totalRatings: profileData.vendorDetails?.totalRatings || 0,
            referralCode: profileData.vendorDetails?.referralCode || '',
            shopDescription: profileData.vendorDetails?.shopDescription || '',
            shopListedAt: profileData.vendorDetails?.shopListedAt || '',
            shopMetaDescription: profileData.vendorDetails?.shopMetaDescription || '',
            shopMetaTitle: profileData.vendorDetails?.shopMetaTitle || '',
            shopName: profileData.vendorDetails?.shopName || ''
          },
          customerDetails: {
            preferences: {
              categories: []
            },
            favorites: []
          },
          adminDetails: {
            permissions: [],
            isSuperAdmin: false,
            accessLevel: '',
            lastLogin: profileData.lastLogin || ''
          },
          _id: profileData._id || '',
          email: profileData.email || '',
          role: profileData.role || '',
          name: profileData.name || '',
          phone: profileData.phone || '',
          isActive: profileData.isActive || false,
          isEmailVerified: false, // Not provided in API
          isPhoneVerified: false, // Not provided in API
          profileImage: null, // Not provided in API
          loginAttempts: 0,
          lastLogin: profileData.lastLogin || '',
          createdAt: profileData.createdAt || '',
          updatedAt: profileData.updatedAt || ''
        };
        
        setUserData(transformedData);
        
        // Update form data with fetched user data
        setFormData({
          name: transformedData.name || '',
          email: transformedData.email || '',
          phone: transformedData.phone || '',
          company: transformedData.vendorDetails?.shopName || '',
          address: formatAddress(transformedData.address),
          bio: transformedData.vendorDetails?.shopDescription || '',
          website: transformedData.vendorDetails?.shopMetaTitle || ''
        });
        
        toast.success('Profile data loaded successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Failed to fetch user data:', err);
      setError(err.message || 'Failed to fetch user data. Please try again.');
      toast.error('Failed to fetch user data');
    } finally {
      setDataLoading(false);
    }
  };

  const formatAddress = (address: Address) => {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state} ${address.pincode}, ${address.country}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileImage = () => {
    if (userData?.profileImage) {
      return userData.profileImage;
    }
    if (userData?.vendorDetails?.shopImages && userData.vendorDetails.shopImages.length > 0) {
      return userData.vendorDetails.shopImages[0];
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="title" width="w-48" className="mb-2" />
            <Skeleton variant="text" width="w-80" />
          </div>
          <Skeleton variant="button" width="w-32" height="h-10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Skeleton */}
          <Card>
            <div className="text-center">
              <Skeleton variant="avatar" className="w-32 h-32 mx-auto mb-4" />
              <Skeleton variant="title" width="w-32" className="mx-auto mb-2" />
              <Skeleton variant="text" width="w-24" className="mx-auto mb-4" />
              <div className="space-y-2">
                <Skeleton variant="text" width="w-40" className="mx-auto" />
                <Skeleton variant="text" width="w-36" className="mx-auto" />
              </div>
            </div>
          </Card>

          {/* Profile Information Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <SkeletonForm />
            <SkeletonForm />
            <SkeletonForm />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Error Loading Profile</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchUserData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">
          <User className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No User Data</h3>
          <p className="text-sm">Unable to load user profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Profile Settings</h1>
                  <p className="text-blue-100">Manage your account information and preferences</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              loading={loading}
              variant="secondary"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : null}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Zap className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Stats */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Profile Picture</h3>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4 overflow-hidden shadow-lg">
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h3>
              <p className="text-gray-600 mb-4">{userData.vendorDetails?.shopName}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(userData.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Statistics */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Account Stats</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{userData.vendorDetails?.subscription?.features?.maxProducts || 0}</p>
                  <p className="text-sm text-gray-600">Max Products</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{userData.vendorDetails?.subscription?.features?.maxImages || 0}</p>
                  <p className="text-sm text-gray-600">Max Images</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{userData.vendorDetails?.totalRatings || 0}</p>
                  <p className="text-sm text-gray-600">Total Ratings</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600">{userData.vendorDetails?.averageRating || 0}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verification</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Email Verified:</span>
                <span className={`font-medium ${userData.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.isEmailVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Phone Verified:</span>
                <span className={`font-medium ${userData.isPhoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.isPhoneVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">KYC Verified:</span>
                <span className={`font-medium ${userData.vendorDetails?.kyc?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.vendorDetails?.kyc?.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  icon={<User className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  icon={<Phone className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Company/Shop Name"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  icon={<Building className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>
          </Card>

          {/* Business Details */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Business Details</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <Input
                label="Business Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<Globe className="w-4 h-4 text-gray-400" />}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Tell us about your business..."
                />
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    Personal Address
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Street:</span> {userData.address?.street}</p>
                    <p><span className="font-medium">City:</span> {userData.address?.city}</p>
                    <p><span className="font-medium">State:</span> {userData.address?.state}</p>
                    <p><span className="font-medium">Pincode:</span> {userData.address?.pincode}</p>
                    <p><span className="font-medium">Country:</span> {userData.address?.country}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-green-500" />
                    Shop Address
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Address:</span> {userData.vendorDetails?.shopAddress?.addressLine1}</p>
                    <p><span className="font-medium">Location:</span> {userData.vendorDetails?.shopAddress?.location}</p>
                    <p><span className="font-medium">Pincode:</span> {userData.vendorDetails?.shopAddress?.pincode}</p>
                    <p><span className="font-medium">Nearby:</span> {userData.vendorDetails?.shopAddress?.nearbyLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Questions */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Security Questions</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{userData.securityQuestions?.question1?.question}</p>
                <p className="text-sm text-gray-600">••••••••••</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{userData.securityQuestions?.question2?.question}</p>
                <p className="text-sm text-gray-600">••••••••••</p>
              </div>
            </div>
          </Card>

          {/* Subscription Details */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Subscription Details</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="font-medium text-gray-900">{userData.vendorDetails?.subscription?.currentPlan}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`font-medium ${userData.vendorDetails?.subscription?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {userData.vendorDetails?.subscription?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">₹{userData.vendorDetails?.subscription?.amount}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(userData.vendorDetails?.subscription?.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(userData.vendorDetails?.subscription?.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Wallet Balance:</span>
                    <span className="font-medium text-gray-900">₹{userData.vendorDetails?.wallet?.balance}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Wallet Transactions */}
          {userData.vendorDetails?.wallet?.transactions && userData.vendorDetails.wallet.transactions.length > 0 && (
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {userData.vendorDetails.wallet.transactions.slice(0, 5).map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                      </div>
                      <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Referral Information */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Referral Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Your Referral Code:</span>
                    <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {userData.vendorDetails?.referralCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">GST Number:</span>
                    <span className="font-medium text-gray-900">{userData.vendorDetails?.gstNumber}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Shop Listed:</span>
                    <span className={`font-medium ${userData.vendorDetails?.isShopListed ? 'text-green-600' : 'text-red-600'}`}>
                      {userData.vendorDetails?.isShopListed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Listed Date:</span>
                    <span className="font-medium text-gray-900">
                      {userData.vendorDetails?.shopListedAt ? formatDate(userData.vendorDetails.shopListedAt) : 'Not Listed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;