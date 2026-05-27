export type UserRole = 'guest' | 'user' | 'admin';

export interface UserLevel {
  level: number;
  label: string;
  currentPoints: number;
  minPoints: number;
  nextLevelPoints: number;
  progressPercent: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarEmoji: string;
  totalPoints: number;
  level: UserLevel;
  collectedStampCount: number;
  totalStampCount: number;
  unlockedBadgeCount: number;
}
