import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MasteryPointsService } from '@/lib/mastery-points-service'

/**
 * GET /api/leaderboard/weekly
 * Récupère le Hall of Fame hebdomadaire (Top 100 de la semaine)
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

    // Récupérer le classement hebdomadaire
    const leaderboard = await MasteryPointsService.getWeeklyLeaderboard(limit)

    // Ajouter le rang
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }))

    // Calculer le numéro de semaine
    const now = new Date()
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
    const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)

    return NextResponse.json({ 
      leaderboard: leaderboardWithRank,
      type: 'weekly',
      week: `Semaine ${weekNumber} - ${now.getFullYear()}`
    })

  } catch (error) {
    console.error('[LEADERBOARD WEEKLY ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement hebdomadaire' },
      { status: 500 }
    )
  }
}


