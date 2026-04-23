import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, MapPin, Phone, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/profile');
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          phone: data.address?.phone || ''
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        }
      };

      const { data } = await api.put('/users/profile', updateData);
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Login</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">{profile?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">{profile?.email || 'Not set'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Street Address
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">{profile?.address?.street || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City</label>
                      <p className="text-lg text-gray-900 dark:text-white">{profile?.address?.city || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">State</label>
                      <p className="text-lg text-gray-900 dark:text-white">{profile?.address?.state || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pincode</label>
                      <p className="text-lg text-gray-900 dark:text-white">{profile?.address?.pincode || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">{profile?.address?.phone || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
