'use client';

import { useState } from 'react';
import { Save, AlertCircle, Settings } from 'lucide-react';

// Define proper TypeScript interfaces
interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  account_type?: string;
}

interface Notifications {
  newOrders: boolean;
  newReviews: boolean;
}

interface UserProfile {
  shopName: string;
  bio: string;
  email: string;
  notifications: Notifications;
}

interface ProfileFormProps {
  user: User | null | undefined;
  userProfile: UserProfile;
}

export default function ProfileForm({ user, userProfile }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [shopName, setShopName] = useState(userProfile.shopName);
  const [bio, setBio] = useState(userProfile.bio);
  const [email] = useState(userProfile.email); // Read-only
  const [notifications, setNotifications] = useState<Notifications>(userProfile.notifications);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // In production, you would make an API call to update the user profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopName,
          bio,
          notifications,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      
      // Show success message for 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = (key: keyof Notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get account type safely
  const accountType = user?.account_type || '';
  const isSeller = accountType === 'seller';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
            <span className="text-green-700">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Section 1: Public Profile */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Public Profile ({isSeller ? 'Shop Story' : 'Public Information'})
          </h2>
          
          {isSeller && (
            <>
              {/* Shop Name */}
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder="Enter your shop name"
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  {isSeller ? 'Artisan Story/Bio' : 'About Me'}
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  placeholder={isSeller 
                    ? "Tell your customers about your passion and craft..." 
                    : "Tell us about yourself..."}
                />
              </div>
            </>
          )}

          {/* For non-seller users, show a simpler profile */}
          {!isSeller && (
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                About Me
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                placeholder="Tell us about yourself..."
              />
            </div>
          )}
        </div>

        {/* Section 2: Account Settings */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
            <Settings className="w-5 h-5 mr-3 text-gray-400" /> Account Preferences
          </h2>
          
          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="mt-1 block w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-2 text-sm text-gray-500">
              Contact support to change your email address.
            </p>
          </div>
          
          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">New Order Notifications</p>
                  <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('newOrders')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.newOrders ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newOrders ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">New Review Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when you receive new reviews</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification('newReviews')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.newReviews ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newReviews ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submission Buttons */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Your profile information is visible to others on the marketplace
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShopName(userProfile.shopName);
                setBio(userProfile.bio);
                setNotifications(userProfile.notifications);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                isSaving 
                  ? 'bg-amber-400 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}