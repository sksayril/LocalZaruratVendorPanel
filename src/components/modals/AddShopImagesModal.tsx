import React, { useState } from 'react';
import { X, Upload, Plus, X as RemoveIcon, Image as ImageIcon } from 'lucide-react';
import { apiService, AddShopImagesResponse } from '../../services/api';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AddShopImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentImageCount: number;
  maxImagesAllowed: number;
}

const AddShopImagesModal: React.FC<AddShopImagesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentImageCount,
  maxImagesAllowed
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const remainingSlots = maxImagesAllowed - currentImageCount;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Check if adding these files would exceed the limit
    if (selectedImages.length + files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more images. You currently have ${currentImageCount} images.`);
      return;
    }

    // Validate file sizes (200MB each)
    const maxSize = 200 * 1024 * 1024; // 200MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the 200MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      
      // Add images with the correct field name
      selectedImages.forEach((image) => {
        formData.append('shopImages', image);
      });

      console.log('Adding shop images...');
      const response = await apiService.addShopImages(formData);
      
      console.log('Add shop images response:', response);
      toast.success(`Successfully added ${response.data.addedImages.length} images!`);
      
      // Reset form
      setSelectedImages([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to add shop images:', error);
      toast.error(error.message || 'Failed to add shop images');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add More Shop Images
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Count Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Current Images: {currentImageCount}
                </p>
                <p className="text-sm text-blue-700">
                  Maximum Allowed: {maxImagesAllowed}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900">
                  Remaining Slots: {remainingSlots}
                </p>
                <p className="text-xs text-blue-600">
                  Max 200MB per image
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Images to Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mb-4">
                You can add up to {remainingSlots} more images (200MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="add-shop-images"
                disabled={remainingSlots === 0}
              />
              <label
                htmlFor="add-shop-images"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${
                  remainingSlots === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Choose Files
              </label>
            </div>
          </div>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Selected Images ({selectedImages.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.map((file, index) => (
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
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning if no slots remaining */}
          {remainingSlots === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                You have reached the maximum number of images ({maxImagesAllowed}). 
                Remove some existing images before adding new ones.
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || selectedImages.length === 0 || remainingSlots === 0}
          >
            {loading ? 'Uploading...' : `Add ${selectedImages.length} Images`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddShopImagesModal; 