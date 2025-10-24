import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/engagement/time-stats
 * Récupère les statistiques de temps de connexion
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer tous les logs de connexion
    const allLogs = await prisma.connectionLog.findMany({
      where: { userId: user.id },
      orderBy: { connectionDate: 'desc' }
    })

    // Calculer les stats
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeekStart = new Date(now)
    thisWeekStart.setDate(now.getDate() - now.getDay())
    thisWeekStart.setHours(0, 0, 0, 0)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total de tous les temps
    const totalMinutes = allLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)

    // Temps aujourd'hui
    const todayLogs = allLogs.filter(log => new Date(log.connectionDate) >= today)
    const todayMinutes = todayLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)

    // Temps cette semaine
    const weekLogs = allLogs.filter(log => new Date(log.connectionDate) >= thisWeekStart)
    const weekMinutes = weekLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)

    // Temps ce mois
    const monthLogs = allLogs.filter(log => new Date(log.connectionDate) >= thisMonthStart)
    const monthMinutes = monthLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)

    // Nombre de sessions
    const totalSessions = allLogs.length
    const todaySessions = todayLogs.length
    const weekSessions = weekLogs.length
    const monthSessions = monthLogs.length

    // Temps moyen par session
    const avgSessionMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0

    // Jours actifs uniques
    const uniqueDays = new Set(allLogs.map(log => 
      new Date(log.connectionDate).toDateString()
    )).size

    // Temps moyen par jour
    const avgDayMinutes = uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0

    // Derniers 7 jours (pour graphique)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const dayLogs = allLogs.filter(log => {
        const logDate = new Date(log.connectionDate)
        return logDate >= date && logDate < nextDay
      })
      
      const dayMinutes = dayLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)
      
      last7Days.push({
        date: date.toISOString(),
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        minutes: dayMinutes,
        sessions: dayLogs.length
      })
    }

    return NextResponse.json({
      total: {
        minutes: totalMinutes,
        hours: Math.floor(totalMinutes / 60),
        sessions: totalSessions
      },
      today: {
        minutes: todayMinutes,
        hours: Math.floor(todayMinutes / 60),
        sessions: todaySessions
      },
      week: {
        minutes: weekMinutes,
        hours: Math.floor(weekMinutes / 60),
        sessions: weekSessions
      },
      month: {
        minutes: monthMinutes,
        hours: Math.floor(monthMinutes / 60),
        sessions: monthSessions
      },
      averages: {
        sessionMinutes: avgSessionMinutes,
        dayMinutes: avgDayMinutes
      },
      activeDays: uniqueDays,
      last7Days
    })

  } catch (error) {
    console.error('[TIME STATS ERROR]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}


