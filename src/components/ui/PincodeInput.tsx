import React, { useState, useEffect } from 'react';
import { Plus, X, MapPin, Loader2 } from 'lucide-react';
import Button from './Button';

interface PincodeData {
  pincode: string;
  district: string;
  state: string;
}

interface PincodeInputProps {
  value: string[];
  onChange: (pincodes: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const PincodeInput: React.FC<PincodeInputProps> = ({
  value = [],
  onChange,
  placeholder = "Enter pincode",
  label = "Available Pincodes",
  error
}) => {
  const [inputValue, setInputValue] = useState('');
  const [pincodeData, setPincodeData] = useState<Record<string, PincodeData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');

  // Pincode validation regex (6 digits)
  const PINCODE_REGEX = /^\d{6}$/;

  // In a real app, this would come from a pincode API
  // For now, we'll create a generic response for any valid pincode
  const getPincodeData = async (pincode: string): Promise<PincodeData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, you would make an API call here:
    // const response = await fetch(`/api/pincode/${pincode}`);
    // return response.json();
    
    // For now, return a generic response
    return {
      pincode,
      district: 'District Information',
      state: 'State Information'
    };
  };

  const validateAndFetchPincode = async (pincode: string): Promise<PincodeData | null> => {
    if (!PINCODE_REGEX.test(pincode)) {
      throw new Error('Pincode must be 6 digits');
    }

    try {
      // Get pincode data from API or generic function
      const pincodeInfo = await getPincodeData(pincode);
      return pincodeInfo;
    } catch (error) {
      console.error('Failed to fetch pincode data:', error);
      // Return a fallback response
      return {
        pincode,
        district: 'District Not Found',
        state: 'State Not Found'
      };
    }
  };

  const handleAddPincode = async () => {
    const trimmedPincode = inputValue.trim();
    
    if (!trimmedPincode) {
      setErrorMessage('Please enter a pincode');
      return;
    }

    if (value.includes(trimmedPincode)) {
      setErrorMessage('Pincode already exists');
      return;
    }

    if (!PINCODE_REGEX.test(trimmedPincode)) {
      setErrorMessage('Pincode must be 6 digits');
      return;
    }

    setLoading(prev => ({ ...prev, [trimmedPincode]: true }));
    setErrorMessage('');

    try {
      const pincodeInfo = await validateAndFetchPincode(trimmedPincode);
      
      if (pincodeInfo) {
        setPincodeData(prev => ({ ...prev, [trimmedPincode]: pincodeInfo }));
        onChange([...value, trimmedPincode]);
        setInputValue('');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to validate pincode');
    } finally {
      setLoading(prev => ({ ...prev, [trimmedPincode]: false }));
    }
  };

  const handleRemovePincode = (pincodeToRemove: string) => {
    const newPincodes = value.filter(p => p !== pincodeToRemove);
    onChange(newPincodes);
    
    // Remove from pincode data
    const newPincodeData = { ...pincodeData };
    delete newPincodeData[pincodeToRemove];
    setPincodeData(newPincodeData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPincode();
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex space-x-2">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
          </div>
        </div>
        <Button
          onClick={handleAddPincode}
          disabled={!inputValue.trim() || Object.values(loading).some(Boolean)}
          size="sm"
          className="px-4"
        >
          {Object.values(loading).some(Boolean) ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Error Messages */}
      {(error || errorMessage) && (
        <p className="text-sm text-red-600">
          {error || errorMessage}
        </p>
      )}

      {/* Pincode Tags */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Added Pincodes ({value.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((pincode) => (
              <div
                key={pincode}
                className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-900">
                    {pincode}
                  </span>
                  {pincodeData[pincode] && (
                    <span className="text-xs text-blue-700">
                      {pincodeData[pincode].district}, {pincodeData[pincode].state}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemovePincode(pincode)}
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Enter 6-digit pincodes and press Enter or click the + button to add them. 
        District information will be fetched from the pincode API.
      </p>
    </div>
  );
};

export default PincodeInput; 