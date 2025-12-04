'use client';

import { signOut } from "next-auth/react";
import { PowerIcon } from '@heroicons/react/24/outline';
import { useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      console.log("Signing out...");
      
      // Clear any client-side storage if needed
      localStorage.removeItem('userPreferences');
      sessionStorage.clear();
      
      // Sign out from NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: "/login"
      });
      
      console.log("Sign out successful");
      
      // Force a full page reload to clear all app state
      window.location.href = "/login";
      
    } catch (error) {
      console.error("Sign out error:", error);
      
      // Fallback: redirect to login anyway
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50"
    >
      <PowerIcon className="w-5 mr-2" />
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}