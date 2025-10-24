import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MasteryPointsService } from '@/lib/mastery-points-service'

/**
 * GET /api/leaderboard/historical
 * Récupère le Hall of Fame historique (Top 100 de tous les temps)
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    // Récupérer le classement historique
    const leaderboard = await MasteryPointsService.getHistoricalLeaderboard(limit)

    // Ajouter le rang
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      badgesCount: user.user_badges.length
    }))

    return NextResponse.json({ 
      leaderboard: leaderboardWithRank,
      type: 'historical'
    })

  } catch (error) {
    console.error('[LEADERBOARD HISTORICAL ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement historique' },
      { status: 500 }
    )
  }
}


