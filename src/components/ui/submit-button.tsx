'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pending?: boolean;
}

export function SubmitButton({ children, className = '', pending }: SubmitButtonProps) {
  const { pending: formPending } = useFormStatus();
  const isPending = pending || formPending;

  return (
    <button 
      type="submit" 
      className={`${className} flex h-10 items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
      disabled={isPending}
      aria-disabled={isPending}
    >
      {isPending ? (
        <div className="flex items-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}