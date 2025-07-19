import React, { useState } from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import ShopSettingsForm, { ShopSettingsData } from '../components/shop/ShopSettingsForm';

const ShopSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ShopSettingsData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Shop settings data:', data);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append('shopName', data.shopName);
      formData.append('shopDescription', data.shopDescription);
      formData.append('shopMetaTitle', data.shopMetaTitle);
      formData.append('shopMetaDescription', data.shopMetaDescription);
      
      // Add keywords
      data.shopMetaKeywords.forEach((keyword, index) => {
        formData.append(`shopMetaKeywords[${index}]`, keyword);
      });
      
      // Add tags
      data.shopMetaTags.forEach((tag, index) => {
        formData.append(`shopMetaTags[${index}]`, tag);
      });
      
      // Add images
      data.shopImages.forEach((file) => {
        formData.append('shopImages', file);
      });

      // Log FormData contents for debugging
      console.log('Sending FormData:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`${key}:`, value);
        }
      }

      // TODO: Replace with actual API call
      // const response = await apiService.updateShopSettings(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      console.log('Shop settings updated successfully');
      
    } catch (error: any) {
      console.error('Failed to update shop settings:', error);
      setError(error.message || 'Failed to update shop settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
          <p className="text-gray-600">Configure your shop information and SEO settings</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Settings Updated</h3>
              <p className="text-sm text-green-700">Your shop settings have been saved successfully.</p>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Settings Form */}
      <Card>
        <ShopSettingsForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default ShopSettings; 