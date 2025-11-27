// lib/auth-utils.ts
import { UserRole } from '@/app/lib/definitions';

export function requireRole(requiredRole: UserRole, userRole: UserRole) {
  if (userRole !== requiredRole) {
    throw new Error('Unauthorized access');
  }
}

export function hasRole(userRole: UserRole, requiredRole: UserRole | UserRole[]) {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}