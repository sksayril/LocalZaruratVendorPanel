import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, X as RemoveIcon, Store, MapPin, Tag, FileText, Globe, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { apiService, Category, SubCategory, ShopListingFormData, ShopListingResponse } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Skeleton, { SkeletonForm } from '../ui/Skeleton';
import toast from 'react-hot-toast';

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
];

// Pincode API Response Interface
interface PincodeResponse {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}

interface ShopListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingData?: ShopListingResponse['shop'];
}

const ShopListingModal: React.FC<ShopListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingData
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [formData, setFormData] = useState<Partial<ShopListingFormData>>({
    shopName: '',
    shopDescription: '',
    shopMetaTitle: '',
    shopMetaDescription: '',
    shopMetaKeywords: [],
    shopMetaTags: [],
    mainCategory: '',
    subCategory: '',
    shopPincode: '',
    shopAddressLine1: '',
    shopAddressLine2: '',
    shopLocation: '',
    nearbyLocation: '',
    coordinates: undefined,
    shopImages: []
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeResponse | null>(null);
  const [showPincodeResults, setShowPincodeResults] = useState(false);
  const [coordinatesLoading, setCoordinatesLoading] = useState(false);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);

  // Load categories on mount
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (existingData) {
        loadExistingData();
      }
    }
  }, [isOpen, existingData]);

  // Load sub-categories when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      loadSubCategories(selectedMainCategory);
    } else {
      setSubCategories([]);
    }
  }, [selectedMainCategory]);

  // Close pincode results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.pincode-results')) {
        setShowPincodeResults(false);
      }
    };

    if (showPincodeResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPincodeResults]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadSubCategories = async (mainCategoryId: string) => {
    try {
      const response = await apiService.getSubCategories(mainCategoryId);
      setSubCategories(response.data);
    } catch (error) {
      console.error('Failed to load sub-categories:', error);
      toast.error('Failed to load sub-categories');
    }
  };

  const loadExistingData = () => {
    if (existingData) {
      setFormData({
        shopName: existingData.shopName || '',
        shopDescription: existingData.shopDescription || '',
        shopMetaTitle: existingData.shopMetaTitle || '',
        shopMetaDescription: existingData.shopMetaDescription || '',
        shopMetaKeywords: existingData.shopMetaKeywords || [],
        shopMetaTags: existingData.shopMetaTags || [],
        mainCategory: existingData.category?.mainCategory._id || '',
        subCategory: existingData.category?.subCategory._id || '',
        shopPincode: existingData.address?.pincode || '',
        shopAddressLine1: existingData.address?.addressLine1 || '',
        shopAddressLine2: existingData.address?.addressLine2 || '',
        shopLocation: existingData.address?.location || '',
        nearbyLocation: existingData.address?.nearbyLocation || '',
        coordinates: existingData.address?.coordinates || undefined,
        shopImages: []
      });
      setSelectedMainCategory(existingData.category?.mainCategory._id || '');
      setSelectedSubCategory(existingData.category?.subCategory._id || '');
      
      // Set state if available in existing data
      if ((existingData.address as any)?.state) {
        setSelectedState((existingData.address as any).state);
      }
    }
  };

  // Fetch pincode data from API
  const fetchPincodeData = async (pincode: string) => {
    if (pincode.length !== 6) {
      setPincodeData(null);
      setShowPincodeResults(false);
      return;
    }

    try {
      setPincodeLoading(true);
      setShowPincodeResults(false);
      
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        setPincodeData(data[0]);
        setShowPincodeResults(true);
        toast.success('Pincode data found!');
      } else {
        setPincodeData(null);
        toast.error('Invalid pincode or no data found');
      }
    } catch (error) {
      console.error('Failed to fetch pincode data:', error);
      setPincodeData(null);
      toast.error('Failed to fetch pincode data');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Auto-fill address from pincode data
  const autoFillAddress = (postOffice: PincodeResponse['PostOffice'][0]) => {
    setFormData(prev => ({
      ...prev,
      shopLocation: postOffice.District,
      shopAddressLine1: `${postOffice.Name}, ${postOffice.Block !== 'NA' ? postOffice.Block : ''}`.trim(),
      shopAddressLine2: postOffice.Division
    }));
    setSelectedState(postOffice.State);
    setShowPincodeResults(false);
    toast.success('Address auto-filled from pincode data!');
  };

  // Get coordinates from address
  const getCoordinatesFromAddress = async () => {
    const address = `${formData.shopAddressLine1}, ${formData.shopLocation}, ${selectedState}, ${formData.shopPincode}`;
    
    if (!formData.shopAddressLine1 || !formData.shopLocation || !selectedState || !formData.shopPincode) {
      toast.error('Please fill in address details first');
      return;
    }

    if (!formData.shopAddressLine1.trim() || !formData.shopLocation.trim() || !selectedState.trim() || !formData.shopPincode.trim()) {
      toast.error('Please fill in all address details');
      return;
    }

    try {
      setCoordinatesLoading(true);
      const coordinates = await apiService.getCoordinatesFromAddress(address);
      setFormData(prev => ({
        ...prev,
        coordinates
      }));
      toast.success(`Coordinates found: ${coordinates.latitude}, ${coordinates.longitude}`);
    } catch (error: any) {
      console.error('Failed to get coordinates:', error);
      toast.error(error.message || 'Failed to get coordinates');
    } finally {
      setCoordinatesLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setCurrentLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', { latitude, longitude });
          
          // Get address from coordinates
          const address = await apiService.getAddressFromCoordinates(latitude, longitude);
          console.log('Address from coordinates:', address);
          
          // Parse address components (basic parsing)
          const addressParts = address.split(', ');
          const pincode = addressParts[addressParts.length - 1]?.match(/\d{6}/)?.[0] || '';
          const state = addressParts[addressParts.length - 2] || '';
          const city = addressParts[addressParts.length - 3] || '';
          const street = addressParts.slice(0, -3).join(', ') || '';
          
          setFormData(prev => ({
            ...prev,
            coordinates: { latitude, longitude },
            shopPincode: pincode,
            shopAddressLine1: street,
            shopLocation: city,
            nearbyLocation: address
          }));
          setSelectedState(state);
          
          toast.success('Current location detected and address filled!');
        } catch (error: any) {
          console.error('Failed to get address from coordinates:', error);
          toast.error('Failed to get address from current location');
        } finally {
          setCurrentLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get current location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        toast.error(errorMessage);
        setCurrentLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleInputChange = (field: keyof ShopListingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.shopMetaKeywords?.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        shopMetaKeywords: [...(prev.shopMetaKeywords || []), keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaKeywords: prev.shopMetaKeywords?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.shopMetaTags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        shopMetaTags: [...(prev.shopMetaTags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaTags: prev.shopMetaTags?.filter((_, i) => i !== index) || []
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      shopImages: [...(prev.shopImages || []), ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopImages: prev.shopImages?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.shopName?.trim()) {
      toast.error('Shop name is required');
      return;
    }
    if (!formData.shopDescription?.trim()) {
      toast.error('Shop description is required');
      return;
    }
    if (!formData.mainCategory) {
      toast.error('Main category is required');
      return;
    }
    if (!formData.subCategory) {
      toast.error('Sub category is required');
      return;
    }
    if (!selectedState) {
      toast.error('State is required');
      return;
    }
    if (!formData.shopPincode?.trim()) {
      toast.error('Pincode is required');
      return;
    }
    if (formData.shopPincode?.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    if (!formData.shopAddressLine1?.trim()) {
      toast.error('Address line 1 is required');
      return;
    }
    if (!formData.shopLocation?.trim()) {
      toast.error('District/Location is required');
      return;
    }

    try {
      setLoading(true);

      const submitFormData = new FormData();
      
      // Add form fields
      submitFormData.append('shopName', formData.shopName || '');
      submitFormData.append('shopDescription', formData.shopDescription || '');
      submitFormData.append('shopMetaTitle', formData.shopMetaTitle || '');
      submitFormData.append('shopMetaDescription', formData.shopMetaDescription || '');
      submitFormData.append('mainCategory', formData.mainCategory || '');
      submitFormData.append('subCategory', formData.subCategory || '');
      submitFormData.append('shopState', selectedState);
      submitFormData.append('shopPincode', formData.shopPincode || '');
      submitFormData.append('shopAddressLine1', formData.shopAddressLine1 || '');
      if (formData.shopAddressLine2) {
        submitFormData.append('shopAddressLine2', formData.shopAddressLine2);
      }
      submitFormData.append('shopLocation', formData.shopLocation || '');
      if (formData.nearbyLocation) {
        submitFormData.append('nearbyLocation', formData.nearbyLocation);
      }

      // Add keywords
      formData.shopMetaKeywords?.forEach((keyword, index) => {
        submitFormData.append(`shopMetaKeywords[${index}]`, keyword);
      });

      // Add tags
      formData.shopMetaTags?.forEach((tag, index) => {
        submitFormData.append(`shopMetaTags[${index}]`, tag);
      });

      // Add coordinates if available
      if (formData.coordinates && formData.coordinates.latitude && formData.coordinates.longitude) {
        submitFormData.append('latitude', formData.coordinates.latitude.toString());
        submitFormData.append('longitude', formData.coordinates.longitude.toString());
      }

      // Add images
      formData.shopImages?.forEach((image) => {
        submitFormData.append('shopImages', image);
      });

      console.log('Submitting shop listing...');
      const response = existingData 
        ? await apiService.updateShopListing(submitFormData)
        : await apiService.createShopListing(submitFormData);
      
      console.log('Shop listing response:', response);
      toast.success(existingData ? 'Shop listing updated successfully!' : 'Shop listed successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to create shop listing:', error);
      toast.error(error.message || 'Failed to create shop listing');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Store className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              {existingData ? 'Edit Shop Listing' : 'List My Business'}
            </h2>
            {existingData && (
              <p className="text-sm text-gray-500 mt-1">
                Update your shop information and coordinates
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        {loading ? (
          <div className="p-6">
            <SkeletonForm />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Existing Shop Data Display */}
          {existingData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-900">Current Shop Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Shop Name</p>
                  <p className="text-blue-600">{existingData.shopName}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Category</p>
                  <p className="text-blue-600">
                    {existingData.category?.mainCategory.name} → {existingData.category?.subCategory.name}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Address</p>
                  <p className="text-blue-600">
                    {existingData.address?.addressLine1}, {existingData.address?.location}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Pincode</p>
                  <p className="text-blue-600">{existingData.address?.pincode}</p>
                </div>
                {existingData.address?.coordinates && (
                  <div className="md:col-span-2">
                    <p className="text-blue-700 font-medium">Current Coordinates</p>
                    <p className="text-blue-600">
                      Lat: {existingData.address.coordinates?.latitude?.toFixed(6) || 'N/A'}, 
                      Lng: {existingData.address.coordinates?.longitude?.toFixed(6) || 'N/A'}
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-blue-700 font-medium">Listed Status</p>
                  <p className="text-blue-600">
                    {existingData.isListed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Listed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Listed
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Store className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name *
                </label>
                <Input
                  type="text"
                  value={formData.shopName || ''}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  placeholder="Enter shop name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Description *
                </label>
                <textarea
                  value={formData.shopDescription || ''}
                  onChange={(e) => handleInputChange('shopDescription', e.target.value)}
                  placeholder="Describe your business"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Category Selection
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category *
                </label>
                <select
                  value={selectedMainCategory}
                  onChange={(e) => {
                    setSelectedMainCategory(e.target.value);
                    setSelectedSubCategory('');
                    handleInputChange('mainCategory', e.target.value);
                    handleInputChange('subCategory', '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select main category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category *
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => {
                    setSelectedSubCategory(e.target.value);
                    handleInputChange('subCategory', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!selectedMainCategory}
                >
                  <option value="">Select sub category</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pincode with Auto-fill */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.shopPincode || ''}
                    onChange={(e) => {
                      const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('shopPincode', pincode);
                      if (pincode.length === 6) {
                        fetchPincodeData(pincode);
                      } else {
                        setPincodeData(null);
                        setShowPincodeResults(false);
                      }
                    }}
                    placeholder="Enter 6-digit pincode"
                    required
                    maxLength={6}
                  />
                  {pincodeLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    </div>
                  )}
                  {formData.shopPincode && formData.shopPincode.length === 6 && !pincodeLoading && (
                    <button
                      type="button"
                      onClick={() => fetchPincodeData(formData.shopPincode || '')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Search className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                    </button>
                  )}
                </div>
                
                {/* Pincode Results Dropdown */}
                {showPincodeResults && pincodeData && (
                  <div className="pincode-results absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-medium text-gray-700">
                        Found {pincodeData.PostOffice.length} post office(s) for pincode {formData.shopPincode}
                      </p>
                    </div>
                    {pincodeData.PostOffice.map((postOffice, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => autoFillAddress(postOffice)}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{postOffice.Name}</div>
                        <div className="text-sm text-gray-600">
                          {postOffice.District}, {postOffice.State}
                        </div>
                        <div className="text-xs text-gray-500">
                          {postOffice.BranchType} • {postOffice.DeliveryStatus}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District/Location *
                </label>
                <Input
                  type="text"
                  value={formData.shopLocation || ''}
                  onChange={(e) => handleInputChange('shopLocation', e.target.value)}
                  placeholder="Enter district or location"
                  required
                />
              </div>
              
              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <Input
                  type="text"
                  value={formData.shopAddressLine1 || ''}
                  onChange={(e) => handleInputChange('shopAddressLine1', e.target.value)}
                  placeholder="Enter street address, building name, etc."
                  required
                />
              </div>
              
              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <Input
                  type="text"
                  value={formData.shopAddressLine2 || ''}
                  onChange={(e) => handleInputChange('shopAddressLine2', e.target.value)}
                  placeholder="Enter apartment, suite, floor, etc. (optional)"
                />
              </div>
              
              {/* Nearby Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nearby Landmarks
                </label>
                <Input
                  type="text"
                  value={formData.nearbyLocation || ''}
                  onChange={(e) => handleInputChange('nearbyLocation', e.target.value)}
                  placeholder="Enter nearby landmarks, metro stations, etc. (optional)"
                />
              </div>

              {/* Coordinates Section */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Location Coordinates
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      loading={currentLocationLoading}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Get Current Location
                    </Button>
                    <Button
                      type="button"
                      onClick={getCoordinatesFromAddress}
                      loading={coordinatesLoading}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      Get from Address
                    </Button>
                  </div>
                </div>
                
                {/* Coordinates Display */}
                {formData.coordinates && formData.coordinates.latitude && formData.coordinates.longitude && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Coordinates Found</p>
                        <p className="text-xs text-green-600">
                          Latitude: {formData.coordinates?.latitude?.toFixed(6) || 'N/A'}, 
                          Longitude: {formData.coordinates?.longitude?.toFixed(6) || 'N/A'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coordinates: undefined }))}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Manual Coordinates Input */}
                {(!formData.coordinates || !formData.coordinates.latitude || !formData.coordinates.longitude) && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Latitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 19.0760"
                        value={formData.coordinates?.latitude || ''}
                        onChange={(e) => {
                          const lat = parseFloat(e.target.value);
                          const lng = formData.coordinates?.longitude || 0;
                          if (!isNaN(lat)) {
                            setFormData(prev => ({
                              ...prev,
                              coordinates: { latitude: lat, longitude: lng }
                            }));
                          } else if (e.target.value === '') {
                            // Clear coordinates if input is empty
                            setFormData(prev => ({
                              ...prev,
                              coordinates: undefined
                            }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Longitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 72.8777"
                        value={formData.coordinates?.longitude || ''}
                        onChange={(e) => {
                          const lng = parseFloat(e.target.value);
                          const lat = formData.coordinates?.latitude || 0;
                          if (!isNaN(lng)) {
                            setFormData(prev => ({
                              ...prev,
                              coordinates: { latitude: lat, longitude: lng }
                            }));
                          } else if (e.target.value === '') {
                            // Clear coordinates if input is empty
                            setFormData(prev => ({
                              ...prev,
                              coordinates: undefined
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              SEO Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <Input
                  type="text"
                  value={formData.shopMetaTitle || ''}
                  onChange={(e) => handleInputChange('shopMetaTitle', e.target.value)}
                  placeholder="Enter meta title for SEO"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.shopMetaDescription || ''}
                  onChange={(e) => handleInputChange('shopMetaDescription', e.target.value)}
                  placeholder="Enter meta description for SEO"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.shopMetaKeywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <RemoveIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.shopMetaTags?.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <RemoveIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shop Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Shop Images
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="shop-images"
                />
                <label
                  htmlFor="shop-images"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Choose Files
                </label>
              </div>
              
              {/* Preview uploaded images */}
              {formData.shopImages && formData.shopImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({formData.shopImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.shopImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <RemoveIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (existingData ? 'Update Listing' : 'List Business')}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default ShopListingModal; 