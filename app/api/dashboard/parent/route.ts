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
        name: true,
        email: true,
        status: true,
        currentTitle: true,
        totalMasteryPoints: true,
        monthlyMasteryPoints: true,
        weeklyMasteryPoints: true,
        connectionStreak: true,
        bestStreak: true,
        badgesUnlocked: true,
        lastConnectionDate: true,
        performances: {
          select: {
            courseId: true,
            videoProgressPercent: true,
            isCompleted: true
          }
        },
        connectionLogs: {
          orderBy: {
            connectedAt: 'desc'
          },
          take: 1
        }
      }
    })

    // Calculer les statistiques pour chaque enfant
    const childrenWithStats = await Promise.all(
      children.map(async (child) => {
        // Compter les cours uniques
        const uniqueCourses = new Set(child.performances.map(p => p.courseId))
        const coursesEnrolled = uniqueCourses.size

        // Calculer la progression moyenne
        const totalProgress = child.performances.reduce((sum, perf) => {
          if (perf.isCompleted) return sum + 100
          return sum + perf.videoProgressPercent
        }, 0)
        const averageCompletion = child.performances.length > 0
          ? Math.round(totalProgress / child.performances.length)
          : 0

        // Dernière connexion
        const lastConnection = child.connectionLogs[0]?.connectedAt || child.lastConnectionDate || new Date()

        // Temps total de connexion (ce mois)
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const monthlyConnectionLogs = await prisma.connectionLog.findMany({
          where: {
            userId: child.id,
            connectedAt: {
              gte: thisMonthStart
            }
          },
          select: {
            durationMinutes: true
          }
        })

        const monthlyConnectionMinutes = monthlyConnectionLogs.reduce(
          (sum, log) => sum + (log.durationMinutes || 0), 
          0
        )

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
          badgesUnlocked: child.badgesUnlocked.length,
          coursesEnrolled,
          averageCompletion,
          lastConnection,
          monthlyConnectionMinutes,
          monthlyConnectionHours: Math.floor(monthlyConnectionMinutes / 60)
        }
      })
    )

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


