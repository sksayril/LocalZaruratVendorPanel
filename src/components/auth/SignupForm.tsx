import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, Building, MapPin, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SignupForm: React.FC = () => {
  // Available security questions
  const availableSecurityQuestions = [
    'What was your first pet\'s name?',
    'In which city were you born?',
    'What was your mother\'s maiden name?',
    'What was the name of your first school?',
    'What is your favorite movie?',
    'What was your childhood nickname?',
    'What is the name of the street you grew up on?',
    'What was your favorite food as a child?'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gstNumber: '',
    mainCategory: '',
    subCategory: '',
    referralCode: '',
    securityQuestions: {
      question1: { question: availableSecurityQuestions[0], answer: '' },
      question2: { question: availableSecurityQuestions[1], answer: '' }
    },
    vendorAddress: {
      doorNumber: '',
      street: '',
      location: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shopImages, setShopImages] = useState<File[]>([]);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else if (name.includes('[')) {
      // Handle nested objects like securityQuestions[question1][answer]
      const matches = name.match(/(\w+)\[(\w+)\]\[(\w+)\]/);
      if (matches) {
        const [, parent, child, subChild] = matches;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: {
              ...prev[parent as keyof typeof prev][child],
              [subChild]: value
            }
          }
        }));
      }
    } else {
    setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecurityQuestionChange = (questionNumber: 'question1' | 'question2', selectedQuestion: string) => {
    setFormData(prev => ({
      ...prev,
      securityQuestions: {
        ...prev.securityQuestions,
        [questionNumber]: {
          question: selectedQuestion,
          answer: '' // Clear answer when question changes
        }
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setShopImages(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setShopImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.gstNumber) {
      newErrors.gstNumber = 'GST number is required';
    }
    if (!formData.mainCategory) {
      newErrors.mainCategory = 'Main category is required';
    }
    if (!formData.subCategory) {
      newErrors.subCategory = 'Sub category is required';
    }
    if (!formData.vendorAddress.doorNumber) {
      newErrors['vendorAddress.doorNumber'] = 'Door number is required';
    }
    if (!formData.vendorAddress.street) {
      newErrors['vendorAddress.street'] = 'Street is required';
    }
    if (!formData.vendorAddress.city) {
      newErrors['vendorAddress.city'] = 'City is required';
    }
    if (!formData.vendorAddress.state) {
      newErrors['vendorAddress.state'] = 'State is required';
    }
    if (!formData.vendorAddress.pincode) {
      newErrors['vendorAddress.pincode'] = 'Pincode is required';
    }
    if (!formData.securityQuestions.question1.answer) {
      newErrors['securityQuestions.question1.answer'] = 'Security question 1 answer is required';
    }
    if (!formData.securityQuestions.question2.answer) {
      newErrors['securityQuestions.question2.answer'] = 'Security question 2 answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('gstNumber', formData.gstNumber);
      formDataToSend.append('mainCategory', formData.mainCategory);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('referralCode', formData.referralCode);
      
      // Add security questions
      formDataToSend.append('securityQuestions[question1][question]', formData.securityQuestions.question1.question);
      formDataToSend.append('securityQuestions[question1][answer]', formData.securityQuestions.question1.answer);
      formDataToSend.append('securityQuestions[question2][question]', formData.securityQuestions.question2.question);
      formDataToSend.append('securityQuestions[question2][answer]', formData.securityQuestions.question2.answer);
      
      // Add address
      formDataToSend.append('vendorAddress[doorNumber]', formData.vendorAddress.doorNumber);
      formDataToSend.append('vendorAddress[street]', formData.vendorAddress.street);
      formDataToSend.append('vendorAddress[location]', formData.vendorAddress.location);
      formDataToSend.append('vendorAddress[city]', formData.vendorAddress.city);
      formDataToSend.append('vendorAddress[state]', formData.vendorAddress.state);
      formDataToSend.append('vendorAddress[pincode]', formData.vendorAddress.pincode);
      formDataToSend.append('vendorAddress[country]', formData.vendorAddress.country);
      
      // Add shop images - This is the key part for multiple file uploads
      shopImages.forEach((file) => {
        formDataToSend.append('shopImages', file);
      });

      // Log FormData contents for debugging
      console.log('Sending FormData with files:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, value.name, value.type, value.size);
        } else {
          console.log(`${key}:`, value);
        }
      }

      // Call signup with FormData - this will now call the real API
      const response = await signup(formDataToSend);
      
      console.log('Signup successful:', response);
      
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      setErrors({ 
        email: error.message || 'Failed to create account. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      {/* Basic Information */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Input
        type="text"
        name="name"
            label="Business Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
            icon={<Building className="w-4 h-4 text-gray-400" />}
            placeholder="Enter your business name"
      />

      <Input
        type="email"
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="w-4 h-4 text-gray-400" />}
        placeholder="Enter your email"
      />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            type="tel"
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            placeholder="Enter your phone number"
          />

          <Input
            type="text"
            name="gstNumber"
            label="GST Number"
            value={formData.gstNumber}
            onChange={handleChange}
            error={errors.gstNumber}
            icon={<Building className="w-4 h-4 text-gray-400" />}
            placeholder="Enter GST number"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Security</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock className="w-4 h-4 text-gray-400" />}
          placeholder="Create a password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={<Lock className="w-4 h-4 text-gray-400" />}
        placeholder="Confirm your password"
      />
        </div>
      </div>

      {/* Business Categories */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Business Categories</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Category
            </label>
            <select
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select main category</option>
              <option value="507f1f77bcf86cd799439011">Electronics</option>
              <option value="507f1f77bcf86cd799439012">Fashion</option>
              <option value="507f1f77bcf86cd799439013">Home & Garden</option>
              <option value="507f1f77bcf86cd799439014">Sports</option>
            </select>
            {errors.mainCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.mainCategory}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub Category
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select sub category</option>
              <option value="507f1f77bcf86cd799439012">Mobile Phones</option>
              <option value="507f1f77bcf86cd799439013">Laptops</option>
              <option value="507f1f77bcf86cd799439014">Accessories</option>
            </select>
            {errors.subCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.subCategory}</p>
            )}
          </div>
        </div>

        <Input
          type="text"
          name="referralCode"
          label="Referral Code (Optional)"
          value={formData.referralCode}
          onChange={handleChange}
          placeholder="Enter referral code if any"
        />
      </div>

      {/* Address */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Business Address</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            type="text"
            name="vendorAddress.doorNumber"
            label="Door Number"
            value={formData.vendorAddress.doorNumber}
            onChange={handleChange}
            error={errors['vendorAddress.doorNumber']}
            placeholder="Door/Flat number"
          />
          
          <Input
            type="text"
            name="vendorAddress.street"
            label="Street"
            value={formData.vendorAddress.street}
            onChange={handleChange}
            error={errors['vendorAddress.street']}
            placeholder="Street name"
          />
        </div>

        <Input
          type="text"
          name="vendorAddress.location"
          label="Location/Area"
          value={formData.vendorAddress.location}
          onChange={handleChange}
          placeholder="Location or area"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            type="text"
            name="vendorAddress.city"
            label="City"
            value={formData.vendorAddress.city}
            onChange={handleChange}
            error={errors['vendorAddress.city']}
            placeholder="City"
          />
          
          <Input
            type="text"
            name="vendorAddress.state"
            label="State"
            value={formData.vendorAddress.state}
            onChange={handleChange}
            error={errors['vendorAddress.state']}
            placeholder="State"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            type="text"
            name="vendorAddress.pincode"
            label="Pincode"
            value={formData.vendorAddress.pincode}
            onChange={handleChange}
            error={errors['vendorAddress.pincode']}
            placeholder="Pincode"
          />
          
          <Input
            type="text"
            name="vendorAddress.country"
            label="Country"
            value={formData.vendorAddress.country}
            onChange={handleChange}
            disabled
            placeholder="Country"
          />
        </div>
      </div>

      {/* Security Questions */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Security Questions</h3>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Question 1
            </label>
            <select
              value={formData.securityQuestions.question1.question}
              onChange={(e) => handleSecurityQuestionChange('question1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 text-sm"
            >
              {availableSecurityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="securityQuestions[question1][answer]"
              value={formData.securityQuestions.question1.answer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Your answer"
            />
            {errors['securityQuestions.question1.answer'] && (
              <p className="mt-1 text-sm text-red-600">{errors['securityQuestions.question1.answer']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Question 2
            </label>
            <select
              value={formData.securityQuestions.question2.question}
              onChange={(e) => handleSecurityQuestionChange('question2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 text-sm"
            >
              {availableSecurityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="securityQuestions[question2][answer]"
              value={formData.securityQuestions.question2.answer}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Your answer"
            />
            {errors['securityQuestions.question2.answer'] && (
              <p className="mt-1 text-sm text-red-600">{errors['securityQuestions.question2.answer']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shop Images */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Shop Images</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Shop Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
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
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>
        </div>

        {shopImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected Files:</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {shopImages.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
        />
        <label htmlFor="terms" className="text-xs sm:text-sm text-gray-900 leading-relaxed">
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <div className="text-center">
        <span className="text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </span>
      </div>
    </form>
  );
};

export default SignupForm;