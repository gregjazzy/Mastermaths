import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/dashboard/parent
 * Récupère les données de performance de tous les enfants d'un parent
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'utilisateur parent
    const parent = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true,
        emailsNotification: true 
      }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Trouver tous les enfants dont l'email du parent est dans emailsNotification
    const children = await prisma.user.findMany({
      where: {
        emailsNotification: {
          has: parent.email
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        currentTitle: true,
        totalMasteryPoints: true,
        monthlyMasteryPoints: true,
        weeklyMasteryPoints: true,
        connectionStreak: true,
        bestStreak: true,
        lastConnectionDate: true,
        badgesUnlocked: true,
        performances: {
          select: {
            id: true,
            lessonId: true,
            videoProgressPercent: true,
            isCompleted: true
          }
        },
        connectionLogs: {
          orderBy: {
            connectedAt: 'desc'
          },
          take: 30,
          select: {
            connectedAt: true,
            durationMinutes: true
          }
        }
      }
    })

    // Calculer les statistiques pour chaque enfant
    const childrenWithStats = children.map((child) => {
      // Calculer la progression moyenne
      const totalProgress = child.performances.reduce((sum: number, perf) => {
        if (perf.isCompleted) return sum + 100
        return sum + perf.videoProgressPercent
      }, 0)
      const averageCompletion = child.performances.length > 0
        ? Math.round(totalProgress / child.performances.length)
        : 0

      // Temps total de connexion (ce mois)
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const monthlyConnectionMinutes = child.connectionLogs
        .filter(log => new Date(log.connectedAt) >= thisMonthStart)
        .reduce((sum: number, log) => sum + (log.durationMinutes || 0), 0)

      return {
        childId: child.id,
        childName: child.name || 'Sans nom',
        childEmail: child.email,
        status: child.status,
        currentTitle: child.currentTitle,
        totalMasteryPoints: child.totalMasteryPoints,
        monthlyMasteryPoints: child.monthlyMasteryPoints,
        weeklyMasteryPoints: child.weeklyMasteryPoints,
        connectionStreak: child.connectionStreak,
        bestStreak: child.bestStreak,
        badgesUnlocked: Array.isArray(child.badgesUnlocked) ? child.badgesUnlocked.length : 0,
        coursesEnrolled: 0,
        averageCompletion,
        lastConnection: child.lastConnectionDate || new Date(),
        monthlyConnectionMinutes,
        monthlyConnectionHours: Math.floor(monthlyConnectionMinutes / 60)
      }
    })

    // Trier par PMU total (du plus élevé au plus faible)
    childrenWithStats.sort((a, b) => b.totalMasteryPoints - a.totalMasteryPoints)

    return NextResponse.json({
      parent: {
        email: parent.email
      },
      children: childrenWithStats,
      summary: {
        totalChildren: childrenWithStats.length,
        totalPMU: childrenWithStats.reduce((sum, c) => sum + c.totalMasteryPoints, 0),
        averageCompletion: childrenWithStats.length > 0
          ? Math.round(childrenWithStats.reduce((sum, c) => sum + c.averageCompletion, 0) / childrenWithStats.length)
          : 0,
        totalBadges: childrenWithStats.reduce((sum, c) => sum + c.badgesUnlocked, 0),
        activeChildren: childrenWithStats.filter(c => {
          const daysSinceConnection = Math.floor(
            (new Date().getTime() - new Date(c.lastConnection).getTime()) / (1000 * 60 * 60 * 24)
          )
          return daysSinceConnection <= 7
        }).length
      }
    })

  } catch (error) {
    console.error('[PARENT DASHBOARD ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}

