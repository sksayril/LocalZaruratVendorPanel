import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, Building, MapPin, Upload, X, Search, Loader2, CheckCircle, ArrowRight, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Puducherry', 'Andaman and Nicobar Islands'
];

// Pincode API Response Interface
interface PincodeResponse {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}

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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeData, setPincodeData] = useState<PincodeResponse | null>(null);
  const [showPincodeResults, setShowPincodeResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Extract referral code from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData(prev => ({
        ...prev,
        referralCode: refCode
      }));
      console.log('Referral code extracted from URL:', refCode);
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories when main category changes
  useEffect(() => {
    if (formData.mainCategory) {
      fetchSubCategories(formData.mainCategory);
    } else {
      setSubCategories([]);
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  }, [formData.mainCategory]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.data);
      console.log('Categories fetched:', response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch subcategories from API
  const fetchSubCategories = async (mainCategoryId: string) => {
    try {
      setSubCategoriesLoading(true);
      const response = await apiService.getSubCategories(mainCategoryId);
      setSubCategories(response.data);
      console.log('Subcategories fetched:', response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to load subcategories');
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  // Check password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [formData.password]);

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

  // Fetch pincode data from API
  const fetchPincodeData = async (pincode: string) => {
    if (pincode.length !== 6) {
      setPincodeData(null);
      setShowPincodeResults(false);
      return;
    }

    try {
      setPincodeLoading(true);
      setShowPincodeResults(false);
      
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        setPincodeData(data[0]);
        setShowPincodeResults(true);
        toast.success('Pincode data found!');
      } else {
        setPincodeData(null);
        toast.error('Invalid pincode or no data found');
      }
    } catch (error) {
      console.error('Failed to fetch pincode data:', error);
      setPincodeData(null);
      toast.error('Failed to fetch pincode data');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Auto-fill address from pincode data
  const autoFillAddress = (postOffice: PincodeResponse['PostOffice'][0]) => {
    setFormData(prev => ({
      ...prev,
      vendorAddress: {
        ...prev.vendorAddress,
        location: postOffice.District,
        city: postOffice.District,
        state: postOffice.State,
        street: `${postOffice.Name}, ${postOffice.Block !== 'NA' ? postOffice.Block : ''}`.trim()
      }
    }));
    setShowPincodeResults(false);
    toast.success('Address auto-filled from pincode data!');
  };

  // Close pincode results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.pincode-results')) {
        setShowPincodeResults(false);
      }
    };

    if (showPincodeResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPincodeResults]);

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
    // GST number is optional, so no validation needed
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
    } else if (formData.vendorAddress.pincode.length !== 6) {
      newErrors['vendorAddress.pincode'] = 'Pincode must be 6 digits';
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'Business Details', icon: Building },
    { id: 3, title: 'Address', icon: MapPin },
    { id: 4, title: 'Security', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h3>
              <p className="text-gray-600">Let's start with your basic business details</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                  label="GST Number (Optional)"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  error={errors.gstNumber}
                  icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                  placeholder="Enter GST number (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength <= 2 ? 'text-red-600' :
                          passwordStrength <= 3 ? 'text-yellow-600' :
                          passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="mt-2 flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
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

            <div className="flex justify-end mt-8">
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Business Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h3>
              <p className="text-gray-600">Tell us about your business category and referral</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Category *
                  </label>
                  <select
                    name="mainCategory"
                    value={formData.mainCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Select main category</option>
                    {categoriesLoading ? (
                      <option value="">Loading categories...</option>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No categories found</option>
                    )}
                  </select>
                  {errors.mainCategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.mainCategory}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category *
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Select sub category</option>
                    {subCategoriesLoading ? (
                      <option value="">Loading subcategories...</option>
                    ) : subCategories.length > 0 ? (
                      subCategories.map((subCategory) => (
                        <option key={subCategory._id} value={subCategory._id}>
                          {subCategory.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No subcategories found for this category</option>
                    )}
                  </select>
                  {errors.subCategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.subCategory}</p>
                  )}
                </div>
              </div>

              <div className="max-w-md">
                <Input
                  type="text"
                  name="referralCode"
                  label="Referral Code (Optional)"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Enter referral code if any"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="px-6 sm:px-8 py-3 rounded-xl font-semibold"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Address</h3>
              <p className="text-gray-600">Enter your business location details</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  type="text"
                  name="vendorAddress.doorNumber"
                  label="Door Number *"
                  value={formData.vendorAddress.doorNumber}
                  onChange={handleChange}
                  error={errors['vendorAddress.doorNumber']}
                  placeholder="Door/Flat number"
                />
                
                <Input
                  type="text"
                  name="vendorAddress.street"
                  label="Street *"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  type="text"
                  name="vendorAddress.city"
                  label="City *"
                  value={formData.vendorAddress.city}
                  onChange={handleChange}
                  error={errors['vendorAddress.city']}
                  placeholder="City"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="vendorAddress.state"
                    value={formData.vendorAddress.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors['vendorAddress.state'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['vendorAddress.state']}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Pincode with Auto-fill */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="vendorAddress.pincode"
                      value={formData.vendorAddress.pincode}
                      onChange={(e) => {
                        const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData(prev => ({
                          ...prev,
                          vendorAddress: {
                            ...prev.vendorAddress,
                            pincode
                          }
                        }));
                        if (pincode.length === 6) {
                          fetchPincodeData(pincode);
                        } else {
                          setPincodeData(null);
                          setShowPincodeResults(false);
                        }
                        if (errors['vendorAddress.pincode']) {
                          setErrors(prev => ({ ...prev, 'vendorAddress.pincode': '' }));
                        }
                      }}
                      placeholder="Enter 6-digit pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                      maxLength={6}
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      </div>
                    )}
                    {formData.vendorAddress.pincode && formData.vendorAddress.pincode.length === 6 && !pincodeLoading && (
                      <button
                        type="button"
                        onClick={() => fetchPincodeData(formData.vendorAddress.pincode)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <Search className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    )}
                  </div>
                  
                  {/* Pincode Results Dropdown */}
                  {showPincodeResults && pincodeData && (
                    <div className="pincode-results absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700">
                          Found {pincodeData.PostOffice.length} post office(s) for pincode {formData.vendorAddress.pincode}
                        </p>
                      </div>
                      {pincodeData.PostOffice.map((postOffice, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => autoFillAddress(postOffice)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{postOffice.Name}</div>
                          <div className="text-sm text-gray-600">
                            {postOffice.District}, {postOffice.State}
                          </div>
                          <div className="text-xs text-gray-500">
                            {postOffice.BranchType} • {postOffice.DeliveryStatus}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors['vendorAddress.pincode'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['vendorAddress.pincode']}</p>
                  )}
                </div>
                
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

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="px-6 sm:px-8 py-3 rounded-xl font-semibold"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Security Questions */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Security Questions</h3>
              <p className="text-gray-600">Set up security questions for account recovery</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Question 1
                  </label>
                  <select
                    value={formData.securityQuestions.question1.question}
                    onChange={(e) => handleSecurityQuestionChange('question1', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3 text-sm bg-white"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Your answer"
                  />
                  {errors['securityQuestions.question1.answer'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['securityQuestions.question1.answer']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Question 2
                  </label>
                  <select
                    value={formData.securityQuestions.question2.question}
                    onChange={(e) => handleSecurityQuestionChange('question2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3 text-sm bg-white"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Your answer"
                  />
                  {errors['securityQuestions.question2.answer'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['securityQuestions.question2.answer']}</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 flex-shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-900 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="px-6 sm:px-8 py-3 rounded-xl font-semibold"
              >
                Previous
              </Button>
              <Button 
                type="submit" 
                loading={loading} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <X className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
                <ul className="mt-1 text-sm text-red-700">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;