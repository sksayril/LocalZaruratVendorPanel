import React, { useState, useEffect } from 'react';
import { 
  Store, 
  MapPin, 
  Calendar, 
  Edit, 
  Plus, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  Globe, 
  CheckCircle, 
  Star,
  TrendingUp,
  Eye,
  Users,
  Award,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { apiService, ShopListingResponse } from '../services/api';
import ShopListingModal from '../components/modals/ShopListingModal';
import AddShopImagesModal from '../components/modals/AddShopImagesModal';
import toast from 'react-hot-toast';

const MyShop: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const [shopData, setShopData] = useState<ShopListingResponse['shop'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isAddImagesModalOpen, setIsAddImagesModalOpen] = useState(false);
  const [shopNotListed, setShopNotListed] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      setError(null);
      setShopNotListed(false);
      
      const response = await apiService.getShopListing();
      
      if (response.data.shop) {
        setShopData(response.data.shop);
      } else {
        setShopNotListed(true);
        setShopData(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch shop data:', err);
      
      // Check if it's a "shop not listed" error
      if (err.message?.includes('not listed') || err.message?.includes('Shop not found')) {
        setShopNotListed(true);
        setShopData(null);
        setError(null);
      } else {
        setError(err.message || 'Failed to fetch shop data');
        setShopData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShopSuccess = () => {
    fetchShopData();
    setIsShopModalOpen(false);
  };

  const handleAddImagesSuccess = () => {
    fetchShopData();
    setIsAddImagesModalOpen(false);
  };

  const getStatusBadge = (isListed: boolean) => {
    if (isListed) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>LISTED</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium">
        <Shield className="w-4 h-4" />
        <span>NOT LISTED</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton variant="title" width="w-48" className="mb-2" />
            <Skeleton variant="text" width="w-80" />
          </div>
          <Skeleton variant="button" width="w-32" height="h-10" />
        </div>

        {/* Shop Details Skeleton */}
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Shop Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchShopData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has active subscription
  if (!hasActiveSubscription) {
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
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">My Shop</h1>
                    <p className="text-blue-100">Manage your business listing on LocalZarurat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Required Message */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Subscription Required</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You need an active subscription to list your business on LocalZarurat. Subscribe to our premium plans to start listing your business and reach more customers.
          </p>
          <Button
            onClick={() => window.location.href = '/my-plans'}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3"
          >
            <Award className="w-5 h-5 mr-2" />
            View Subscription Plans
          </Button>
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
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">My Shop</h1>
                  <p className="text-blue-100">Manage your business listing on LocalZarurat</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {shopData ? (
                <Button
                  onClick={() => setIsShopModalOpen(true)}
                  variant="secondary"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Listing
                </Button>
              ) : (
                <Button
                  onClick={() => setIsShopModalOpen(true)}
                  variant="secondary"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List My Business
                </Button>
              )}
            </div>
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

      {!shopData && shopNotListed ? (
        /* Shop Not Listed State - Premium Design */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Business Listed Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start your journey by listing your business on LocalZarurat. Reach more customers and grow your business with our platform.
          </p>
          <Button
            onClick={() => setIsShopModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            List My Business
          </Button>
        </div>
      ) : shopData ? (
        /* Shop Data Display - Premium Cards */
        <div className="space-y-6">
          {/* Business Overview Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{shopData.shopName}</h2>
                    <p className="text-gray-600">Business Listing</p>
                  </div>
                </div>
                {getStatusBadge(shopData.isListed)}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Description</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {shopData.shopDescription || 'No description provided'}
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Tag className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold">Category</h3>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Main Category:</span>
                        <span className="font-medium text-purple-700">
                          {shopData.category?.mainCategory.name || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sub Category:</span>
                        <span className="font-medium text-purple-700">
                          {shopData.category?.subCategory.name || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Address Information Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Address Line 1:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.address?.addressLine1 || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Address Line 2:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.address?.addressLine2 || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.address?.location || 'Not specified'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pincode:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.address?.pincode || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Nearby Location:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.address?.nearbyLocation || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Listed Date:</span>
                    <span className="font-medium text-gray-900">
                      {shopData.listedAt ? formatDate(shopData.listedAt) : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SEO Information Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">SEO Information</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">
                        {shopData.shopMetaTitle || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">
                        {shopData.shopMetaDescription || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {shopData.shopMetaKeywords && shopData.shopMetaKeywords.length > 0 ? (
                      shopData.shopMetaKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full font-medium"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No keywords specified</span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {shopData.shopMetaTags && shopData.shopMetaTags.length > 0 ? (
                      shopData.shopMetaTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No tags specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Shop Images Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Shop Images ({shopData.shopImages?.length || 0})
                  </h3>
                </div>
                <Button
                  onClick={() => setIsAddImagesModalOpen(true)}
                  variant="primary"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Images
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {shopData.shopImages && shopData.shopImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {shopData.shopImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Shop image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No images uploaded yet</p>
                  <Button
                    onClick={() => setIsAddImagesModalOpen(true)}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-blue-600 mb-1">1,247</h4>
              <p className="text-blue-700 font-medium">Total Views</p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-green-600 mb-1">89</h4>
              <p className="text-green-700 font-medium">Customer Leads</p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-purple-600 mb-1">4.8</h4>
              <p className="text-purple-700 font-medium">Rating</p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-orange-600 mb-1">23%</h4>
              <p className="text-orange-700 font-medium">Growth</p>
            </Card>
          </div>
        </div>
      ) : null}

      {/* Modals */}
      <ShopListingModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        onSuccess={handleShopSuccess}
        existingData={shopData || undefined}
      />
      
             <AddShopImagesModal
         isOpen={isAddImagesModalOpen}
         onClose={() => setIsAddImagesModalOpen(false)}
         onSuccess={handleAddImagesSuccess}
         currentImageCount={shopData?.shopImages?.length || 0}
         maxImagesAllowed={10}
       />
    </div>
  );
};

export default MyShop; 