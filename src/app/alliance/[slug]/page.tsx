import { notFound } from 'next/navigation'
import { getAllianceBySlug } from '@/lib/db'
import { getAllianceById } from '@/lib/pnw-api'
import AlliancePage from '@/components/alliance/AlliancePage'

interface AlliancePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AllianceSubdomainPage({ params }: AlliancePageProps) {
  const { slug } = await params

  // Get alliance data from database
  const allianceData = await getAllianceBySlug(slug)

  if (!allianceData) {
    notFound()
  }

  // Get fresh data from PNW API
  let pnwData = null
  try {
    pnwData = await getAllianceById(allianceData.alliance_id)
  } catch (error) {
    console.error('Error fetching PNW data:', error)
  }

  return (
    <AlliancePage
      alliance={allianceData}
      pnwData={pnwData}
    />
  )
}

// Generate metadata for the alliance page
export async function generateMetadata({ params }: AlliancePageProps) {
  const { slug } = await params
  const alliance = await getAllianceBySlug(slug)

  if (!alliance) {
    return {
      title: 'Alliance Not Found',
      description: 'The requested alliance could not be found.',
    }
  }

  return {
    title: `${alliance.alliance_name} - Alliance Management`,
    description: `Alliance management dashboard for ${alliance.alliance_name} (${alliance.alliance_acronym}) in Politics and War.`,
    openGraph: {
      title: `${alliance.alliance_name} - Alliance Management`,
      description: `Alliance management dashboard for ${alliance.alliance_name}`,
    },
  }
}