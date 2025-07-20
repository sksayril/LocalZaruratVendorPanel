import React from 'react';
import { Navigate } from 'react-router-dom';
import { Store, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/ui/Card';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-600">Local</span>
            <span className="text-orange-500">Zarurat</span>
          </h1>
          <p className="text-gray-600">Sign in to your seller account</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 LocalZarurat. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-400">
            Developed by <span className="font-semibold text-blue-600">Cripcocode Technologies Pvt Ltd</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;