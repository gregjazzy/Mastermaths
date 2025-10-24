import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MasteryPointsService } from '@/lib/mastery-points-service'

export const dynamic = 'force-dynamic'

/**
 * GET /api/leaderboard/monthly
 * Récupère le Hall of Fame mensuel (Top 100 du mois)
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

    // Récupérer le classement mensuel
    const leaderboard = await MasteryPointsService.getMonthlyLeaderboard(limit)

    // Ajouter le rang
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }))

    return NextResponse.json({ 
      leaderboard: leaderboardWithRank,
      type: 'monthly',
      month: new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    })

  } catch (error) {
    console.error('[LEADERBOARD MONTHLY ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement mensuel' },
      { status: 500 }
    )
  }
}


