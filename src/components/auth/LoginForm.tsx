import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setLoading(true);
    try {
      // Call the real login API
      const response = await login(email, password);
      
      console.log('Login successful:', response);
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle different types of errors
      if (error.message.includes('Invalid credentials') || error.message.includes('401')) {
        setErrors({ email: 'Invalid email or password' });
      } else if (error.message.includes('User not found')) {
        setErrors({ email: 'User not found' });
      } else if (error.message.includes('Network')) {
        setErrors({ email: 'Network error. Please check your connection.' });
      } else {
        setErrors({ email: error.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        icon={<Mail className="w-4 h-4 text-gray-400" />}
        placeholder="Enter your email"
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock className="w-4 h-4 text-gray-400" />}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Sign In
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;