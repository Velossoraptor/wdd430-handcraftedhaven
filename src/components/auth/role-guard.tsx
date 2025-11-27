
'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/lib/definitions';

interface RoleGuardProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return fallback || <div>Please log in to access this content.</div>;
  }

  const userRole = session.user.role;
  const hasAccess = Array.isArray(allowedRoles) 
    ? allowedRoles.includes(userRole)
    : userRole === allowedRoles;

  if (!hasAccess) {
    return fallback || <div>You do not have permission to view this content.</div>;
  }

  return <>{children}</>;
}