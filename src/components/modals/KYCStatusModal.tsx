import React from 'react';
import { X, CheckCircle, XCircle, Clock, AlertCircle, Calendar, FileText } from 'lucide-react';
import { KYCStatusResponse } from '../../services/api';

interface KYCStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycData: KYCStatusResponse | null;
  loading: boolean;
}

const KYCStatusModal: React.FC<KYCStatusModalProps> = ({ isOpen, onClose, kycData, loading }) => {
  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">KYC Status Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading KYC status...</p>
              </div>
            </div>
          ) : kycData ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Overall Status</h3>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(kycData.overallStatus)}`}>
                    {getStatusIcon(kycData.overallStatus)}
                    <span className="font-medium capitalize">{kycData.overallStatus.replace('_', ' ')}</span>
                  </div>
                </div>
                {kycData.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      <strong>Rejection Reason:</strong> {kycData.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* PAN Card Status */}
              {kycData.panCard && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>PAN Card</span>
                    </h4>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(kycData.panCard.status)}`}>
                      {getStatusIcon(kycData.panCard.status)}
                      <span className="font-medium capitalize">{kycData.panCard.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {kycData.panCard.submittedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {formatDate(kycData.panCard.submittedAt)}</span>
                      </div>
                    )}
                    {kycData.panCard.verifiedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Verified: {formatDate(kycData.panCard.verifiedAt)}</span>
                      </div>
                    )}
                    {kycData.panCard.rejectionReason && (
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Reason: {kycData.panCard.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aadhar Card Status */}
              {kycData.aadharCard && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Aadhar Card</span>
                    </h4>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(kycData.aadharCard.status)}`}>
                      {getStatusIcon(kycData.aadharCard.status)}
                      <span className="font-medium capitalize">{kycData.aadharCard.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {kycData.aadharCard.submittedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {formatDate(kycData.aadharCard.submittedAt)}</span>
                      </div>
                    )}
                    {kycData.aadharCard.verifiedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Verified: {formatDate(kycData.aadharCard.verifiedAt)}</span>
                      </div>
                    )}
                    {kycData.aadharCard.rejectionReason && (
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Reason: {kycData.aadharCard.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* General Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-blue-900 mb-2">General Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  {kycData.submittedAt && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>KYC Submitted: {formatDate(kycData.submittedAt)}</span>
                    </div>
                  )}
                  {kycData.verifiedAt && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>KYC Verified: {formatDate(kycData.verifiedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No KYC data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCStatusModal; 