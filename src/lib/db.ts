import { supabase, createServerSupabaseClient } from './supabase'
import { User, WhitelistedAlliance, UserAlliance } from '@/types'

// User operations
export const getUserByDiscordId = async (discordId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('discord_id', discordId)
    .single()

  if (error || !data) return null
  return data as User
}

export const createUser = async (userData: {
  discord_id: string
  discord_username: string
  discord_avatar?: string
}): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error || !data) return null
  return data as User
}

export const updateUserApiKey = async (
  userId: string,
  apiKey: string,
  nationId?: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .update({
      pnw_api_key: apiKey,
      pnw_nation_id: nationId,
    })
    .eq('id', userId)

  return !error
}

// Whitelisted alliances operations
export const getWhitelistedAlliances = async (): Promise<WhitelistedAlliance[]> => {
  const { data, error } = await supabase
    .from('whitelisted_alliances')
    .select('*')
    .eq('is_active', true)
    .order('alliance_name')

  if (error || !data) return []
  return data as WhitelistedAlliance[]
}

export const getAllianceBySlug = async (slug: string): Promise<WhitelistedAlliance | null> => {
  const { data, error } = await supabase
    .from('whitelisted_alliances')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as WhitelistedAlliance
}

export const getAllianceById = async (allianceId: number): Promise<WhitelistedAlliance | null> => {
  const { data, error } = await supabase
    .from('whitelisted_alliances')
    .select('*')
    .eq('alliance_id', allianceId)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as WhitelistedAlliance
}

export const addWhitelistedAlliance = async (
  allianceData: {
    alliance_id: number
    alliance_name: string
    alliance_acronym?: string
    slug: string
    added_by_user_id: string
  }
): Promise<WhitelistedAlliance | null> => {
  const serverClient = createServerSupabaseClient()

  const { data, error } = await serverClient
    .from('whitelisted_alliances')
    .insert(allianceData)
    .select()
    .single()

  if (error || !data) return null
  return data as WhitelistedAlliance
}

// User alliances operations
export const getUserAlliances = async (userId: string): Promise<UserAlliance[]> => {
  const { data, error } = await supabase
    .from('user_alliances')
    .select('*')
    .eq('user_id', userId)

  if (error || !data) return []
  return data as UserAlliance[]
}

export const addUserToAlliance = async (
  userId: string,
  allianceId: number,
  role: 'member' | 'officer' | 'leader' = 'member'
): Promise<boolean> => {
  const { error } = await supabase
    .from('user_alliances')
    .insert({
      user_id: userId,
      alliance_id: allianceId,
      role,
    })

  return !error
}

export const updateUserAllianceRole = async (
  userId: string,
  allianceId: number,
  role: 'member' | 'officer' | 'leader'
): Promise<boolean> => {
  const { error } = await supabase
    .from('user_alliances')
    .update({ role })
    .eq('user_id', userId)
    .eq('alliance_id', allianceId)

  return !error
}

// API key request operations
export const createApiKeyRequest = async (
  userId: string,
  apiKey: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('api_key_requests')
    .insert({
      user_id: userId,
      api_key: apiKey,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error || !data) return null
  return data.id
}

export const updateApiKeyRequestStatus = async (
  requestId: string,
  status: 'validated' | 'failed',
  validationData?: any
): Promise<boolean> => {
  const { error } = await supabase
    .from('api_key_requests')
    .update({
      status,
      validation_data: validationData,
    })
    .eq('id', requestId)

  return !error
}

// Admin operations
export const isUserAdmin = async (discordId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('discord_id', discordId)
    .single()

  if (error || !data) return false
  return data.is_admin
}