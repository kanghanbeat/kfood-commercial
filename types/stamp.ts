export type StampCategory = 'region' | 'food' | 'seasonal' | 'event';

export interface Stamp {
  id: string;
  name: string;
  description: string;
  category: StampCategory;
  regionName?: string;
  foodTag?: string;
  icon: string;
  isCollected: boolean;
  collectedAt?: string;
  earnHint: string;
}

export interface RegionBadge {
  id: string;
  regionName: string;
  badgeName: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progressCurrent: number;
  progressTarget: number;
  progressPercent: number;
  earnHint: string;
}

export interface StampSummary {
  collected: number;
  total: number;
  completionPercent: number;
}
