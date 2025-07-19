import React, { useState } from 'react';
import { Building, Upload, X, Plus, Save, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ShopSettingsFormProps {
  onSubmit?: (data: ShopSettingsData) => void;
  loading?: boolean;
}

export interface ShopSettingsData {
  shopName: string;
  shopDescription: string;
  shopMetaTitle: string;
  shopMetaDescription: string;
  shopMetaKeywords: string[];
  shopMetaTags: string[];
  shopImages: File[];
}

const ShopSettingsForm: React.FC<ShopSettingsFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<ShopSettingsData>({
    shopName: '',
    shopDescription: '',
    shopMetaTitle: '',
    shopMetaDescription: '',
    shopMetaKeywords: ['electronics', 'mobile phones', 'laptops', 'mumbai', 'gadgets'],
    shopMetaTags: ['trusted', 'quality', 'authorized dealer'],
    shopImages: []
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, shopImages: [...prev.shopImages, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopImages: prev.shopImages.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.shopMetaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        shopMetaKeywords: [...prev.shopMetaKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaKeywords: prev.shopMetaKeywords.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.shopMetaTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        shopMetaTags: [...prev.shopMetaTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shopMetaTags: prev.shopMetaTags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <Input
          type="text"
          name="shopName"
          label="Shop Name"
          value={formData.shopName}
          onChange={handleChange}
          icon={<Building className="w-4 h-4 text-gray-400" />}
          placeholder="Enter your shop name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Description
          </label>
          <textarea
            name="shopDescription"
            value={formData.shopDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your shop and what makes it special..."
            required
          />
        </div>
      </div>

      {/* SEO Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">SEO Information</h3>
        
        <Input
          type="text"
          name="shopMetaTitle"
          label="Meta Title"
          value={formData.shopMetaTitle}
          onChange={handleChange}
          placeholder="Enter meta title for SEO"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            name="shopMetaDescription"
            value={formData.shopMetaDescription}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter meta description for SEO..."
            required
          />
        </div>
      </div>

      {/* Meta Keywords */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Meta Keywords</h3>
        
        <div className="flex gap-2">
          <Input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add a keyword"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addKeyword}
            variant="outline"
            className="px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.shopMetaKeywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Meta Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Meta Tags</h3>
        
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.shopMetaTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Shop Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Shop Images</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Shop Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload images of your shop or products
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="shop-images"
            />
            <label
              htmlFor="shop-images"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>
        </div>

        {formData.shopImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected Files:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.shopImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button type="submit" loading={loading} className="px-8">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ShopSettingsForm; 