import type { LoginResult, MockUser, UserRole } from '@/types/auth';

const mockUsers: Record<string, MockUser> = {
  'user@kfood.test': {
    id: 'mock-user-1',
    email: 'user@kfood.test',
    role: 'user',
    name: 'K-Food Traveler',
  },
  'admin@kfood.test': {
    id: 'mock-admin-1',
    email: 'admin@kfood.test',
    role: 'admin',
    name: 'K-Food Admin',
  },
};

let currentUser: MockUser | null = null;

export function mockLogin(email: string, password: string): LoginResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (!password.trim()) {
    return {
      success: false,
      error: 'Please enter a password.',
    };
  }

  const user = mockUsers[normalizedEmail];

  if (!user) {
    return {
      success: false,
      error: 'No mock account was found for this email.',
    };
  }

  currentUser = user;

  return {
    success: true,
    user,
  };
}

export function mockLogout(): void {
  currentUser = null;
}

export function getCurrentUser(): MockUser | null {
  return currentUser;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}

export function isAdmin(): boolean {
  return currentUser?.role === 'admin';
}

export function checkAccess(requiredRole: UserRole): boolean {
  if (requiredRole === 'guest') {
    return true;
  }

  if (!currentUser) {
    return false;
  }

  if (requiredRole === 'user') {
    return currentUser.role === 'user' || currentUser.role === 'admin';
  }

  return currentUser.role === 'admin';
}
