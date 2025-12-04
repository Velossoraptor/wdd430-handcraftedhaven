import { auth } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { User, Camera } from 'lucide-react';
import ProfileForm from './profileform';

export default async function SellerProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  // Get user data from session
  const user = session.user;
  
  
  const userProfile = {
    shopName: user?.account_type === 'seller' ? 'Artisan User Shop' : 'User Profile',
    bio: user?.account_type === 'seller' 
      ? 'I have been crafting ceramic pottery since 2010...' 
      : 'Welcome to my profile!',
    email: user?.email || 'user@handcraftedhaven.com',
    notifications: {
      newOrders: true,
      newReviews: false,
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
        
        {/* Header */}
        <header className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-amber-900 flex items-center">
                <User className="w-8 h-8 mr-3 text-amber-600" aria-hidden="true" />
                {user?.account_type === 'seller' ? 'Seller Profile' : 'User Profile'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.account_type === 'seller' 
                  ? 'Manage your public bio, shop story, and account preferences.' 
                  : 'Manage your profile and account settings.'}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                {user?.account_type?.toUpperCase() || 'USER'} ACCOUNT
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-4">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 flex items-center justify-center mx-auto">
                    <div className="text-4xl font-bold text-amber-800">
                      {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                
                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium capitalize">{user?.account_type || 'user'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-mono text-xs text-gray-400 truncate">{user?.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <ProfileForm 
              user={user}
              userProfile={userProfile}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}