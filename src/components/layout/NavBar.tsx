'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import SignOutButton from '@/components/signout-button';


interface ExtendedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  account_type?: string;
}

export default function NavBar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get user display name
  const getUserDisplayName = () => {
    if (!session?.user) return '';
    
    if (session.user.name) return session.user.name;
    if (session.user.email) {
      const email = session.user.email;
      return email.split('@')[0];
    }
    return '';
  };

  // Get account type from session 
  const getAccountType = () => {
    if (!session?.user) return '';
    
    
    const user = session.user as ExtendedUser;
    return user.account_type || '';
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900 bg-gray-200 animate-pulse w-40 h-6 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo*/}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Handcrafted Haven
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`${
                pathname === '/' 
                  ? 'text-amber-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              } transition-colors font-medium`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`${
                pathname === '/products' 
                  ? 'text-amber-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              } transition-colors font-medium`}
            >
              Marketplace
            </Link>
            <Link 
              href="/about" 
              className={`${
                pathname === '/about' 
                  ? 'text-amber-600 font-semibold' 
                  : 'text-gray-700 hover:text-gray-900'
              } transition-colors font-medium`}
            >
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  Welcome, {getUserDisplayName()}
                  {getAccountType() && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {getAccountType()}
                    </span>
                  )}
                </span>
                <Link 
                  href="/dashboard"
                  className={`${
                    pathname === '/dashboard' 
                      ? 'bg-amber-600' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white px-4 py-2 rounded-md transition-colors font-medium text-sm`}
                >
                  Dashboard
                </Link>
               
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                  className={`${
                    pathname === '/login' 
                      ? 'text-amber-600 font-semibold' 
                      : 'text-gray-700 hover:text-gray-900'
                  } transition-colors font-medium text-sm`}
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className={`${
                    pathname === '/signup' 
                      ? 'bg-amber-600' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white px-4 py-2 rounded-md transition-colors font-medium text-sm`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
            <div className="flex flex-col space-y-3">
              {/* Mobile Navigation Links */}
              <Link 
                href="/" 
                className={`${
                  pathname === '/' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-gray-900'
                } transition-colors font-medium px-3 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`${
                  pathname === '/products' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-gray-900'
                } transition-colors font-medium px-3 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/about" 
                className={`${
                  pathname === '/about' 
                    ? 'text-amber-600 font-semibold' 
                    : 'text-gray-700 hover:text-gray-900'
                } transition-colors font-medium px-3 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                {session ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      {getAccountType() && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                            {getAccountType()} Account
                          </span>
                        </p>
                      )}
                    </div>
                    <Link 
                      href="/dashboard"
                      className={`block w-full ${
                        pathname === '/dashboard' 
                          ? 'bg-amber-600' 
                          : 'bg-amber-500 hover:bg-amber-600'
                      } text-white px-3 py-2 rounded-md text-center transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    
                    <div onClick={() => setIsMenuOpen(false)}>
                      <SignOutButton />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/login"
                      className={`block w-full ${
                        pathname === '/login' 
                          ? 'text-amber-600 border-amber-600' 
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      } border px-3 py-2 rounded-md text-center transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className={`block w-full ${
                        pathname === '/signup' 
                          ? 'bg-amber-600' 
                          : 'bg-amber-500 hover:bg-amber-600'
                      } text-white px-3 py-2 rounded-md text-center transition-colors font-medium`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}