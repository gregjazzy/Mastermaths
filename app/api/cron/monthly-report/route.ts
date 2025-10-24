import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email-service'

export const dynamic = 'force-dynamic'

/**
 * CRON Job : Envoyer le récapitulatif mensuel à tous les utilisateurs actifs
 * À appeler le 1er de chaque mois via un service externe (cron-job.org)
 * 
 * URL: /api/cron/monthly-report
 */
export async function GET(req: Request) {
  try {
    // Sécurité : Vérifier un token CRON (optionnel)
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    
    if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Token CRON invalide' },
        { status: 401 }
      )
    }

    // Récupérer tous les utilisateurs actifs (DEMO ou PREMIUM) avec email
    const allUsers = await prisma.user.findMany({
      where: {
        status: { in: ['DEMO', 'PREMIUM'] }
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailsNotification: true,
        currentStreak: true
      }
    })

    // Filtrer ceux qui ont un email
    const users = allUsers.filter(u => u.email !== null)

    const results = []
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    for (const user of users) {
      // Calculer les stats du mois dernier
      const performances = await prisma.performance.findMany({
        where: {
          userId: user.id,
          lastAccessedAt: {
            gte: lastMonth,
            lt: thisMonth
          }
        }
      })

      const lessonsCompleted = performances.filter(p => p.isCompleted).length
      const qcmsTaken = performances.filter(p => p.quizScorePercent !== null).length
      
      const scores = performances
        .filter(p => p.quizScorePercent !== null)
        .map(p => p.quizScorePercent || 0)
      
      const averageScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

      // Temps passé le mois dernier
      const connectionLogs = await prisma.connectionLog.findMany({
        where: {
          userId: user.id,
          connectionDate: {
            gte: lastMonth,
            lt: thisMonth
          }
        }
      })

      const timeSpent = connectionLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)

      // Badges débloqués le mois dernier
      const badgesUnlocked = await prisma.user_badges.count({
        where: {
          userId: user.id,
          unlockedAt: {
            gte: lastMonth,
            lt: thisMonth
          }
        }
      })

      // PMU gagnés le mois dernier (approximatif via monthlyMasteryPoints)
      const userStats = await prisma.user.findUnique({
        where: { id: user.id },
        select: { monthlyMasteryPoints: true }
      })

      const pmuEarned = userStats?.monthlyMasteryPoints || 0

      // Ne pas envoyer d'email si aucune activité
      if (lessonsCompleted === 0 && qcmsTaken === 0) {
        results.push({
          userId: user.id,
          email: user.email,
          status: 'skipped',
          reason: 'Aucune activité le mois dernier'
        })
        continue
      }

      // Envoyer l'email
      try {
        await EmailService.sendMonthlyReport(
          user.email || '',
          user.name || 'Élève',
          {
            lessonsCompleted,
            qcmsTaken,
            averageScore,
            timeSpent,
            badgesUnlocked,
            currentStreak: user.currentStreak,
            pmuEarned
          },
          user.emailsNotification || []
        )

        results.push({
          userId: user.id,
          email: user.email,
          status: 'sent'
        })
      } catch (error) {
        console.error(`Erreur lors de l'envoi du rapport mensuel pour ${user.email}:`, error)
        results.push({
          userId: user.id,
          email: user.email,
          status: 'error',
          error: String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Rapports mensuels envoyés',
      totalUsers: users.length,
      emailsSent: results.filter(r => r.status === 'sent').length,
      emailsSkipped: results.filter(r => r.status === 'skipped').length,
      emailsFailed: results.filter(r => r.status === 'error').length,
      results
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi des rapports mensuels:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    )
  }
}

