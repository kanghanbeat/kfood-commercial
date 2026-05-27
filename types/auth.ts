export type UserRole = 'guest' | 'user' | 'admin';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type MockUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type LoginResult = {
  success: boolean;
  user?: MockUser;
  error?: string;
};
