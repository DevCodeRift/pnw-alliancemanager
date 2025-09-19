// Politics and War API client
import { PNWAlliance, PNWNation } from '@/types'

const PNW_API_URL = process.env.PNW_API_BASE_URL || 'https://api.politicsandwar.com/graphql'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

// Generic GraphQL request function
async function graphqlRequest<T>(query: string, apiKey?: string): Promise<T | null> {
  const url = apiKey ? `${PNW_API_URL}?api_key=${apiKey}` : PNW_API_URL

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors) {
      throw new Error(result.errors.map(e => e.message).join(', '))
    }

    return result.data || null
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

// Get alliance by ID
export async function getAllianceById(allianceId: number, apiKey?: string): Promise<PNWAlliance | null> {
  const query = `
    query {
      alliances(id: [${allianceId}], first: 1) {
        data {
          id
          name
          acronym
          score
          color
          rank
          flag
          date
          accept_members
          nations {
            id
            nation_name
            leader_name
            score
            num_cities
            last_active
          }
        }
      }
    }
  `

  const result = await graphqlRequest<{ alliances: { data: PNWAlliance[] } }>(query, apiKey)
  return result?.alliances.data[0] || null
}

// Search alliances by name
export async function searchAlliances(searchTerm: string, apiKey?: string): Promise<PNWAlliance[]> {
  const query = `
    query {
      alliances(name: ["${searchTerm}"], first: 10) {
        data {
          id
          name
          acronym
          score
          color
          rank
          flag
          date
          accept_members
        }
      }
    }
  `

  const result = await graphqlRequest<{ alliances: { data: PNWAlliance[] } }>(query, apiKey)
  return result?.alliances.data || []
}

// Get nation by ID (for API key validation)
export async function getNationById(nationId: number, apiKey: string): Promise<PNWNation | null> {
  const query = `
    query {
      nations(id: [${nationId}], first: 1) {
        data {
          id
          nation_name
          leader_name
          alliance_id
          alliance {
            id
            name
            acronym
          }
          score
          num_cities
          color
          last_active
        }
      }
    }
  `

  const result = await graphqlRequest<{ nations: { data: PNWNation[] } }>(query, apiKey)
  return result?.nations.data[0] || null
}

// Validate API key by checking if it can access the "me" endpoint
export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; nation?: PNWNation; error?: string }> {
  const query = `
    query {
      me {
        nation {
          id
          nation_name
          leader_name
          alliance_id
          alliance {
            id
            name
            acronym
          }
          score
          num_cities
          color
          last_active
        }
      }
    }
  `

  try {
    const result = await graphqlRequest<{ me: { nation: PNWNation } }>(query, apiKey)

    if (result?.me.nation) {
      return {
        valid: true,
        nation: result.me.nation,
      }
    }

    return {
      valid: false,
      error: 'API key is valid but could not retrieve nation data',
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Create slug from alliance name
export function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}