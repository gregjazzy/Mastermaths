import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


/**
 * GET /api/dashboard/user-stats
 * Récupère les statistiques de gamification de l'utilisateur
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les stats de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        currentTitle: true,
        totalMasteryPoints: true,
        monthlyMasteryPoints: true,
        weeklyMasteryPoints: true,
        currentStreak: true,
        longestStreak: true,
        user_badges: {
          select: {
            id: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      currentTitle: user.currentTitle,
      totalMasteryPoints: user.totalMasteryPoints,
      monthlyMasteryPoints: user.monthlyMasteryPoints,
      weeklyMasteryPoints: user.weeklyMasteryPoints,
      connectionStreak: user.currentStreak,
      bestStreak: user.longestStreak,
      badgesCount: user.user_badges.length
    })

  } catch (error) {
    console.error('[USER STATS ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}


