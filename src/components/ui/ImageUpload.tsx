import React, { useState, useRef } from 'react';
import { Upload, X, Eye, Trash2, Camera } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  label?: string;
  maxImages?: number;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images = [],
  onChange,
  label = "Product Images",
  maxImages = 5,
  accept = "image/*"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URLs when images change
  React.useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup function to revoke object URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return false;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return false;
      }

      return true;
    });

    // Check if adding these files would exceed maxImages
    if (images.length + newFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    onChange([...images, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="space-y-2">
            <Camera className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <span className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                Choose files
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB each. Max {maxImages} images.
            </p>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Selected Images ({images.length}/{maxImages})
            </p>
            {images.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange([])}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((file, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                {/* Image Preview */}
                <div className="aspect-square relative">
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(previewUrls[index], '_blank');
                        }}
                        className="bg-white text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="bg-white text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Primary Image Indicator */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      Primary
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500">
            First image will be the primary product image. Drag images to reorder.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 