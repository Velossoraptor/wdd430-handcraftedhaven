'use client';

import { signOutAction } from '@/app/lib/actions';
import { PowerIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export default function SignOutForm() {
  return (
    <form action={signOutAction}>
      <Button 
        type="submit"
        className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        <PowerIcon className="w-5 mr-2" />
        Sign Out
      </Button>
    </form>
  );
}