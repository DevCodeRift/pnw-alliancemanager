export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          discord_id: string
          discord_username: string
          discord_avatar: string | null
          pnw_api_key: string | null
          pnw_nation_id: number | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          discord_id: string
          discord_username: string
          discord_avatar?: string | null
          pnw_api_key?: string | null
          pnw_nation_id?: number | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          discord_id?: string
          discord_username?: string
          discord_avatar?: string | null
          pnw_api_key?: string | null
          pnw_nation_id?: number | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      whitelisted_alliances: {
        Row: {
          id: string
          alliance_id: number
          alliance_name: string
          alliance_acronym: string | null
          slug: string
          added_by_user_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          alliance_id: number
          alliance_name: string
          alliance_acronym?: string | null
          slug: string
          added_by_user_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          alliance_id?: number
          alliance_name?: string
          alliance_acronym?: string | null
          slug?: string
          added_by_user_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whitelisted_alliances_added_by_user_id_fkey"
            columns: ["added_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_alliances: {
        Row: {
          id: string
          user_id: string
          alliance_id: number
          role: 'member' | 'officer' | 'leader'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alliance_id: number
          role?: 'member' | 'officer' | 'leader'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alliance_id?: number
          role?: 'member' | 'officer' | 'leader'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alliances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      api_key_requests: {
        Row: {
          id: string
          user_id: string
          api_key: string
          status: 'pending' | 'validated' | 'failed'
          validation_data: Json | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          api_key: string
          status?: 'pending' | 'validated' | 'failed'
          validation_data?: Json | null
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          api_key?: string
          status?: 'pending' | 'validated' | 'failed'
          validation_data?: Json | null
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_key_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}