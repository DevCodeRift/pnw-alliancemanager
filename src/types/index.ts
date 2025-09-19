// User Types
export interface User {
  id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar?: string;
  pnw_api_key?: string;
  pnw_nation_id?: number;
  created_at: string;
  updated_at: string;
}

// Alliance Types
export interface Alliance {
  id: number;
  name: string;
  acronym?: string;
  score: number;
  color?: string;
  flag?: string;
  is_whitelisted: boolean;
}

export interface WhitelistedAlliance {
  id: string;
  alliance_id: number;
  alliance_name: string;
  alliance_acronym?: string;
  slug: string;
  added_by_user_id: string;
  created_at: string;
  is_active: boolean;
}

export interface UserAlliance {
  id: string;
  user_id: string;
  alliance_id: number;
  role: 'member' | 'officer' | 'leader';
  created_at: string;
}

// PNW API Types
export interface PNWNation {
  id: number;
  nation_name: string;
  leader_name: string;
  alliance_id?: number;
  alliance?: {
    id: number;
    name: string;
    acronym?: string;
  };
  score: number;
  num_cities: number;
  color?: string;
  last_active: string;
}

export interface PNWAlliance {
  id: number;
  name: string;
  acronym?: string;
  score: number;
  color?: string;
  rank: number;
  flag?: string;
  nations?: PNWNation[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface SessionUser {
  id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar?: string;
  has_api_key: boolean;
  alliances: UserAlliance[];
}