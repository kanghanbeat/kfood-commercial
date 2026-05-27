export type RankingPeriod = 'weekly' | 'monthly' | 'allTime';

export interface RankingUser {
  id: string;
  rank: number;
  displayName: string;
  avatarEmoji: string;
  points: number;
  stampCount: number;
  badgeCount: number;
  regionTitle: string;
}
