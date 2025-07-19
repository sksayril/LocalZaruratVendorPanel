import React, { useState, useEffect } from 'react';
import { Upload, Loader2, CreditCard, CheckCircle, User, Shield, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { apiService } from '../services/api';

const KYC: React.FC = () => {
  // KYC Status states
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected' | 'not_submitted'>('not_submitted');
  const [kycStatusLoading, setKycStatusLoading] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);

  // PAN Card states
  const [panNumber, setPanNumber] = useState<string>('');
  const [panImage, setPanImage] = useState<File | null>(null);
  const [panLoading, setPanLoading] = useState(false);
  const [panError, setPanError] = useState<string | null>(null);
  const [panSuccess, setPanSuccess] = useState<boolean>(false);
  const [panUploadedData, setPanUploadedData] = useState<{
    panNumber: string;
    panImage: string;
  } | null>(null);

  // Aadhar Card states
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [aadharFrontImage, setAadharFrontImage] = useState<File | null>(null);
  const [aadharBackImage, setAadharBackImage] = useState<File | null>(null);
  const [aadharLoading, setAadharLoading] = useState(false);
  const [aadharError, setAadharError] = useState<string | null>(null);
  const [aadharSuccess, setAadharSuccess] = useState<boolean>(false);
  const [aadharUploadedData, setAadharUploadedData] = useState<{
    aadharNumber: string;
    aadharFrontImage: string;
    aadharBackImage: string;
  } | null>(null);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      setKycStatusLoading(true);
      const response = await apiService.getKYCStatus();
      setKycStatus(response.data.status);
      setKycError(null);
    } catch (err) {
      console.error('Failed to fetch KYC status:', err);
      setKycError('Failed to fetch KYC status. Please try again.');
      setKycStatusLoading(false);
    }
  };

  const getStatusBadge = (status: typeof kycStatus) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Loader2,
        text: 'Under Review'
      },
      verified: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Verified'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: Shield,
        text: 'Rejected'
      },
      not_submitted: {
        color: 'bg-gray-100 text-gray-800',
        icon: Shield,
        text: 'Not Submitted'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${config.color}`}>
        <Icon className="w-4 h-4" />
        <span>{config.text}</span>
      </span>
    );
  };

  const handlePanFileChange = (file: File | null) => {
    setPanImage(file);
    setPanError(null);
    setPanSuccess(false);
  };

  const handleAadharFrontFileChange = (file: File | null) => {
    setAadharFrontImage(file);
    setAadharError(null);
    setAadharSuccess(false);
  };

  const handleAadharBackFileChange = (file: File | null) => {
    setAadharBackImage(file);
    setAadharError(null);
    setAadharSuccess(false);
  };

  const handlePanSubmit = async () => {
    if (!panNumber.trim()) {
      setPanError('Please enter your PAN number');
      return;
    }

    if (!panImage) {
      setPanError('Please select a PAN Card image');
      return;
    }

    try {
      setPanLoading(true);
      setPanError(null);
      setPanSuccess(false);

      const formData = new FormData();
      formData.append('panNumber', panNumber.trim());
      formData.append('panImage', panImage);

      console.log('Submitting PAN Card details...');
      console.log('PAN Number:', panNumber);
      console.log('PAN Image:', panImage.name);

      const response = await apiService.uploadPANCard(formData);
      
      console.log('PAN Card upload response:', response);
      
      if (response.success) {
        setPanSuccess(true);
        setPanUploadedData(response.data);
        setPanNumber('');
        setPanImage(null);
        // Refresh KYC status after successful upload
        fetchKYCStatus();
      } else {
        setPanError(response.message || 'Failed to upload PAN Card details');
      }
    } catch (err) {
      console.error('Failed to upload PAN Card:', err);
      setPanError(err instanceof Error ? err.message : 'Failed to upload PAN Card details');
    } finally {
      setPanLoading(false);
    }
  };

  const handleAadharSubmit = async () => {
    if (!aadharNumber.trim()) {
      setAadharError('Please enter your Aadhar number');
      return;
    }

    if (!aadharFrontImage) {
      setAadharError('Please select Aadhar Card front image');
      return;
    }

    if (!aadharBackImage) {
      setAadharError('Please select Aadhar Card back image');
      return;
    }

    try {
      setAadharLoading(true);
      setAadharError(null);
      setAadharSuccess(false);

      // Remove spaces from Aadhar number for API
      const cleanAadharNumber = aadharNumber.replace(/\s/g, '');

      const formData = new FormData();
      formData.append('aadharNumber', cleanAadharNumber);
      formData.append('aadharFrontImage', aadharFrontImage);
      formData.append('aadharBackImage', aadharBackImage);

      console.log('Submitting Aadhar Card details...');
      console.log('Aadhar Number:', cleanAadharNumber);
      console.log('Aadhar Front Image:', aadharFrontImage.name);
      console.log('Aadhar Back Image:', aadharBackImage.name);

      const response = await apiService.uploadAadharCard(formData);
      
      console.log('Aadhar Card upload response:', response);
      
      if (response.success) {
        setAadharSuccess(true);
        setAadharUploadedData(response.data);
        setAadharNumber('');
        setAadharFrontImage(null);
        setAadharBackImage(null);
        // Refresh KYC status after successful upload
        fetchKYCStatus();
      } else {
        setAadharError(response.message || 'Failed to upload Aadhar Card details');
      }
    } catch (err) {
      console.error('Failed to upload Aadhar Card:', err);
      setAadharError(err instanceof Error ? err.message : 'Failed to upload Aadhar Card details');
    } finally {
      setAadharLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with KYC Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Upload your PAN Card and Aadhar Card for verification</p>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(kycStatus)}
          <Button
            onClick={fetchKYCStatus}
            disabled={kycStatusLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${kycStatusLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </Button>
        </div>
      </div>

      {/* KYC Status Error Message */}
      {kycError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{kycError}</p>
        </div>
      )}

      {/* PAN Card Success Message */}
      {panSuccess && panUploadedData && (
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800">PAN Card Uploaded Successfully!</h3>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-green-800">PAN Number:</span>
                  <span className="ml-2 text-green-700">{panUploadedData.panNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Image URL:</span>
                  <span className="ml-2 text-green-700 break-all">{panUploadedData.panImage}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* PAN Card Form */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">PAN Card Details</h3>
          
          <div className="space-y-6">
            {/* PAN Number Input */}
            <div>
              <Input
                label="PAN Number *"
                type="text"
                placeholder="ABCDE1234F"
                value={panNumber}
                onChange={(e) => {
                  setPanNumber(e.target.value.toUpperCase());
                  setPanError(null);
                  setPanSuccess(false);
                }}
                icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                maxLength={10}
                className="uppercase"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter your 10-digit PAN number (e.g., ABCDE1234F)
              </p>
            </div>

            {/* PAN Card Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Card Image *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a clear image of your PAN Card
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePanFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="panImage"
                />
                <label htmlFor="panImage" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    {panImage ? panImage.name : 'Choose file'}
                  </span>
                </label>
                {panImage && (
                  <p className="text-sm text-gray-500 mt-1">{panImage.name}</p>
                )}
              </div>
            </div>

            {panError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{panError}</p>
              </div>
            )}

            <Button
              onClick={handlePanSubmit}
              disabled={panLoading || !panNumber.trim() || !panImage}
              className="w-full"
            >
              {panLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload PAN Card Details'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Aadhar Card Success Message */}
      {aadharSuccess && aadharUploadedData && (
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800">Aadhar Card Uploaded Successfully!</h3>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-green-800">Aadhar Number:</span>
                  <span className="ml-2 text-green-700">{aadharUploadedData.aadharNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Front Image URL:</span>
                  <span className="ml-2 text-green-700 break-all">{aadharUploadedData.aadharFrontImage}</span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Back Image URL:</span>
                  <span className="ml-2 text-green-700 break-all">{aadharUploadedData.aadharBackImage}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aadhar Card Form */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Aadhar Card Details</h3>
          
          <div className="space-y-6">
            {/* Aadhar Number Input */}
            <div>
              <Input
                label="Aadhar Number *"
                type="text"
                placeholder="1234 5678 9012"
                value={aadharNumber}
                onChange={(e) => {
                  // Format Aadhar number with spaces for display
                  const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                  setAadharNumber(value);
                  setAadharError(null);
                  setAadharSuccess(false);
                }}
                icon={<User className="w-4 h-4 text-gray-400" />}
                maxLength={14} // 12 digits + 2 spaces
                className="tracking-wider"
              />
              <p className="text-sm text-gray-600 mt-1">
                Enter your 12-digit Aadhar number (e.g., 1234 5678 9012)
              </p>
            </div>

            {/* Aadhar Card Front Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Card Front Image *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a clear image of the front side of your Aadhar Card
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAadharFrontFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadharFrontImage"
                />
                <label htmlFor="aadharFrontImage" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    {aadharFrontImage ? aadharFrontImage.name : 'Choose file'}
                  </span>
                </label>
                {aadharFrontImage && (
                  <p className="text-sm text-gray-500 mt-1">{aadharFrontImage.name}</p>
                )}
              </div>
            </div>

            {/* Aadhar Card Back Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhar Card Back Image *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a clear image of the back side of your Aadhar Card
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAadharBackFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadharBackImage"
                />
                <label htmlFor="aadharBackImage" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    {aadharBackImage ? aadharBackImage.name : 'Choose file'}
                  </span>
                </label>
                {aadharBackImage && (
                  <p className="text-sm text-gray-500 mt-1">{aadharBackImage.name}</p>
                )}
              </div>
            </div>

            {aadharError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{aadharError}</p>
              </div>
            )}

            <Button
              onClick={handleAadharSubmit}
              disabled={aadharLoading || !aadharNumber.trim() || !aadharFrontImage || !aadharBackImage}
              className="w-full"
            >
              {aadharLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Aadhar Card Details'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KYC; 