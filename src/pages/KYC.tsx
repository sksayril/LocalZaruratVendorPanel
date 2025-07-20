import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  User, 
  Shield, 
  RefreshCw,
  AlertTriangle,
  FileText,
  Camera,
  Award,
  Sparkles,
  Zap,
  Eye,
  Clock,
  XCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton, { SkeletonCard } from '../components/ui/Skeleton';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface KYCData {
  panNumber?: string;
  panImage?: string;
  aadharNumber?: string;
  aadharFrontImage?: string;
  aadharBackImage?: string;
  isVerified?: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  status?: string;
}

const KYC: React.FC = () => {
  // KYC Status states
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [kycStatusLoading, setKycStatusLoading] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);

  // PAN Card states
  const [panNumber, setPanNumber] = useState<string>('');
  const [panImage, setPanImage] = useState<File | null>(null);
  const [panLoading, setPanLoading] = useState(false);
  const [panError, setPanError] = useState<string | null>(null);
  const [panSuccess, setPanSuccess] = useState<boolean>(false);

  // Aadhar Card states
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [aadharFrontImage, setAadharFrontImage] = useState<File | null>(null);
  const [aadharBackImage, setAadharBackImage] = useState<File | null>(null);
  const [aadharLoading, setAadharLoading] = useState(false);
  const [aadharError, setAadharError] = useState<string | null>(null);
  const [aadharSuccess, setAadharSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      setKycStatusLoading(true);
      setKycError(null);
      const response = await apiService.getKYCStatus();
      setKycData(response.data);
    } catch (err) {
      console.error('Failed to fetch KYC status:', err);
      setKycError('Failed to fetch KYC status. Please try again.');
    } finally {
      setKycStatusLoading(false);
    }
  };

  const getKYCStatus = () => {
    if (!kycData) return 'not_submitted';
    if (kycData.isVerified) return 'verified';
    if (kycData.panNumber && kycData.aadharNumber) return 'pending';
    return 'not_submitted';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        icon: Clock,
        text: 'Under Review',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200'
      },
      verified: {
        color: 'bg-gradient-to-r from-green-500 to-emerald-600',
        icon: CheckCircle,
        text: 'Verified',
        bg: 'bg-green-50',
        border: 'border-green-200'
      },
      rejected: {
        color: 'bg-gradient-to-r from-red-500 to-pink-600',
        icon: XCircle,
        text: 'Rejected',
        bg: 'bg-red-50',
        border: 'border-red-200'
      },
      not_submitted: {
        color: 'bg-gradient-to-r from-gray-500 to-gray-600',
        icon: Shield,
        text: 'Not Submitted',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 px-4 py-2 ${config.color} text-white rounded-full text-sm font-medium`}>
        <Icon className="w-4 h-4" />
        <span>{config.text}</span>
      </div>
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
        setPanNumber('');
        setPanImage(null);
        toast.success('PAN Card uploaded successfully!');
        // Refresh KYC status after successful upload
        fetchKYCStatus();
      } else {
        setPanError(response.message || 'Failed to upload PAN Card details');
        toast.error(response.message || 'Failed to upload PAN Card details');
      }
    } catch (err) {
      console.error('Failed to upload PAN Card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload PAN Card details';
      setPanError(errorMessage);
      toast.error(errorMessage);
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
        setAadharNumber('');
        setAadharFrontImage(null);
        setAadharBackImage(null);
        toast.success('Aadhar Card uploaded successfully!');
        // Refresh KYC status after successful upload
        fetchKYCStatus();
      } else {
        setAadharError(response.message || 'Failed to upload Aadhar Card details');
        toast.error(response.message || 'Failed to upload Aadhar Card details');
      }
    } catch (err) {
      console.error('Failed to upload Aadhar Card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload Aadhar Card details';
      setAadharError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setAadharLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (kycStatusLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="title" width="w-48" className="mb-2" />
            <Skeleton variant="text" width="w-80" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton variant="button" width="w-24" height="h-8" />
            <Skeleton variant="button" width="w-32" height="h-8" />
          </div>
        </div>

        {/* Upload Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const kycStatus = getKYCStatus();

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">KYC Verification</h1>
                  <p className="text-purple-100">Complete your identity verification to unlock all features</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(kycStatus)}
              <Button
                onClick={fetchKYCStatus}
                disabled={kycStatusLoading}
                variant="secondary"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${kycStatusLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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

      {/* KYC Status Error Message */}
      {kycError && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-center space-x-3 p-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{kycError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* KYC Status Overview */}
      {kycData && (
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">KYC Status Overview</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Verification Status:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                {kycData.verificationDate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Verified On:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(kycData.verificationDate)}
                    </span>
                  </div>
                )}
                {kycData.verifiedBy && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Verified By:</span>
                    <span className="font-medium text-gray-900">
                      {kycData.verifiedBy}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">PAN Card:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.panNumber ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Aadhar Card:</span>
                  <span className="font-medium text-gray-900">
                    {kycData.aadharNumber ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* PAN Card Success Message */}
      {panSuccess && (
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-center space-x-3 p-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-700">PAN Card uploaded successfully!</p>
            </div>
          </div>
        </Card>
      )}

      {/* PAN Card Form */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">PAN Card Details</h3>
          </div>
        </div>
        
        <div className="p-6">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
      {aadharSuccess && (
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-center space-x-3 p-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-700">Aadhar Card uploaded successfully!</p>
            </div>
          </div>
        </Card>
      )}

      {/* Aadhar Card Form */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aadhar Card Details</h3>
          </div>
        </div>
        
        <div className="p-6">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAadharFrontFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadharFrontImage"
                />
                <label htmlFor="aadharFrontImage" className="cursor-pointer">
                  <span className="text-orange-600 hover:text-orange-500 font-medium">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAadharBackFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadharBackImage"
                />
                <label htmlFor="aadharBackImage" className="cursor-pointer">
                  <span className="text-orange-600 hover:text-orange-500 font-medium">
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
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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

      {/* Uploaded Documents Preview */}
      {kycData && (kycData.panImage || kycData.aadharFrontImage) && (
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Uploaded Documents</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kycData.panImage && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                    PAN Card
                  </h4>
                  <div className="relative group">
                    <img
                      src={kycData.panImage}
                      alt="PAN Card"
                      className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">PAN: {kycData.panNumber}</p>
                </div>
              )}
              
              {kycData.aadharFrontImage && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-orange-500" />
                    Aadhar Card
                  </h4>
                  <div className="relative group">
                    <img
                      src={kycData.aadharFrontImage}
                      alt="Aadhar Card Front"
                      className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Aadhar: {kycData.aadharNumber}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KYC; 