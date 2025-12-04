// app/components/auth-status.tsx (updated)
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check', {
          cache: 'no-store', // Don't cache auth check
        });
        const data = await response.json();
        
        setIsLoggedIn(data.isAuthenticated);
        setUserEmail(data.user?.email || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        setUserEmail(null);
        router.push('/login');
        router.refresh(); // This is key to update server components
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <span className="text-sm text-gray-700">Welcome, {userEmail}</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      Login
    </button>
  );
}