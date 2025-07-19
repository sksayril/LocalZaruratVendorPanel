import React, { useState } from 'react';
import { X, Building, Upload, Save, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { apiService, ShopListingResponse } from '../../services/api';

interface ShopInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ShopListingResponse['shop'] | null;
}

const ShopInfoModal: React.FC<ShopInfoModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    shopName: initialData?.shopName || 'John Electronics Store',
    shopDescription: initialData?.shopDescription || 'Best electronics store in Mumbai with premium quality products and excellent customer service. We specialize in mobile phones, laptops, and accessories.',
    shopMetaTitle: initialData?.shopMetaTitle || 'John Electronics Store - Best Electronics Shop in Mumbai',
    shopMetaDescription: initialData?.shopMetaDescription || 'Discover premium electronics at John Electronics Store. Best prices, quality products, and excellent service in Mumbai. Mobile phones, laptops, accessories.',
    shopMetaKeywords: initialData?.shopMetaKeywords || ['electronics', 'mobile phones', 'laptops', 'mumbai', 'gadgets'],
    shopMetaTags: initialData?.shopMetaTags || ['trusted', 'quality', 'authorized dealer'],
  });

  const [shopImages, setShopImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.shopMetaKeywords];
    newKeywords[index] = value;
    setFormData(prev => ({
      ...prev,
      shopMetaKeywords: newKeywords
    }));
  };

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      shopMetaKeywords: [...prev.shopMetaKeywords, '']
    }));
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaKeywords: prev.shopMetaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.shopMetaTags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      shopMetaTags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      shopMetaTags: [...prev.shopMetaTags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaTags: prev.shopMetaTags.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setShopImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setShopImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('shopName', formData.shopName);
      formDataToSend.append('shopDescription', formData.shopDescription);
      formDataToSend.append('shopMetaTitle', formData.shopMetaTitle);
      formDataToSend.append('shopMetaDescription', formData.shopMetaDescription);
      
      // Add keywords
      formData.shopMetaKeywords.forEach((keyword, index) => {
        formDataToSend.append(`shopMetaKeywords[${index}]`, keyword);
      });
      
      // Add tags
      formData.shopMetaTags.forEach((tag, index) => {
        formDataToSend.append(`shopMetaTags[${index}]`, tag);
      });
      
      // Add shop images
      shopImages.forEach((file) => {
        formDataToSend.append('shopImages', file);
      });

      const response = await apiService.createShopListing(formDataToSend);
      console.log('Shop listing created:', response);
      onSuccess();
    } catch (err) {
      console.error('Failed to create shop listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to save shop information');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Shop Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name *
                </label>
                <Input
                  type="text"
                  value={formData.shopName}
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
                  value={formData.shopDescription}
                  onChange={(e) => handleInputChange('shopDescription', e.target.value)}
                  placeholder="Enter shop description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title *
                </label>
                <Input
                  type="text"
                  value={formData.shopMetaTitle}
                  onChange={(e) => handleInputChange('shopMetaTitle', e.target.value)}
                  placeholder="Enter meta title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description *
                </label>
                <textarea
                  value={formData.shopMetaDescription}
                  onChange={(e) => handleInputChange('shopMetaDescription', e.target.value)}
                  placeholder="Enter meta description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="space-y-2">
                  {formData.shopMetaKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        placeholder="Enter keyword"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addKeyword}
                    variant="outline"
                    className="w-full"
                  >
                    Add Keyword
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.shopMetaTags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="Enter tag"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="w-full"
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              {/* Shop Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Images
                </label>
                <div className="space-y-3">
                  {shopImages.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Upload className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload images
                      </span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
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
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Shop Information
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopInfoModal; 