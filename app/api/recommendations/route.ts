import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRecommendedLesson, getUserProgressStats } from '@/lib/recommendation-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('includeStats') === 'true'

    const recommendation = await getRecommendedLesson(session.user.id)

    if (includeStats) {
      const stats = await getUserProgressStats(session.user.id)
      return NextResponse.json({
        recommendation,
        stats
      })
    }

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

