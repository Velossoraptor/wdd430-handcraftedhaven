'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { 
  UserCircleIcon, 
  PowerIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
      >
        <UserCircleIcon className="w-5 h-5" />
        <span>{session.user?.name || session.user?.email}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <PowerIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}