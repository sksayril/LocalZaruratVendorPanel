import React, { useState } from 'react';
import { Camera, Save, User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: '123 Business St, New York, NY 10001',
    bio: 'Experienced vendor with a passion for quality products and customer satisfaction.',
    website: 'https://example.com'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          loading={loading}
        >
          {isEditing ? <Save className="w-4 h-4 mr-2" /> : null}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.company}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user?.phone}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<User className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<Mail className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<Phone className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<Building className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
            <div className="space-y-4">
              <Input
                label="Business Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Tell us about your business..."
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">48</p>
                <p className="text-sm text-gray-600">Active Products</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">1.2k</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">92%</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;