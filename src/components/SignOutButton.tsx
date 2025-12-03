'use client';

import { signOut } from 'next-auth/react';

interface SignOutButtonProps {
  className?: string;
  mobile?: boolean;
}

export default function SignOutButton({ className = '', mobile = false }: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button 
      onClick={handleSignOut}
      className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium ${
        mobile ? 'w-full text-center' : ''
      } ${className}`}
    >
      Sign Out
    </button>
  );
}