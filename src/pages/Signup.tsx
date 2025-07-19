import React from 'react';
import { Navigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/SignupForm';
import Card from '../components/ui/Card';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join VendorPro</h1>
          <p className="text-gray-600">Create your vendor account today</p>
        </div>

        <Card>
          <SignupForm />
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 VendorPro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;