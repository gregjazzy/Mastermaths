import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/access-control'
import { BadgeService } from '@/lib/badge-service'
import { ConnectionService } from '@/lib/connection-service'
import { EmailService } from '@/lib/email-service'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
export const dynamic = 'force-dynamic'


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les informations de connexion
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || undefined
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : headersList.get('x-real-ip') || undefined

    // TOUJOURS créer un log de connexion (pas de limite par jour)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const connectionLog = await prisma.connectionLog.create({
      data: {
        userId: user.id,
        connectionDate: today
      }
    })

    // Incrémenter le compteur de JOURS (max 1x par jour pour les badges)
    const incrementedDay = await BadgeService.incrementConnectionDaysCount(user.id)

    // Mettre à jour le streak de connexion
    const newStreak = await ConnectionService.updateConnectionStreak(user.id)

    // Envoyer email de célébration pour les milestones (7, 30, 100 jours)
    if (incrementedDay && [7, 30, 100].includes(newStreak)) {
      const userWithEmails = await prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true, name: true, emailsNotification: true }
      })
      
      if (userWithEmails) {
        await EmailService.sendStreakCelebration(
          userWithEmails.email,
          userWithEmails.name || 'Étudiant',
          newStreak,
          userWithEmails.emailsNotification
        )
      }
    }

    // Compter le nombre total de connexions aujourd'hui
    const connectionsToday = await prisma.connectionLog.count({
      where: {
        userId: user.id,
        connectionDate: {
          gte: today
        }
      }
    })

    // Compter le nombre total de connexions (tout historique)
    const totalConnections = await prisma.connectionLog.count({
      where: { userId: user.id }
    })

    // Récupérer le meilleur streak
    const userStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: { longestStreak: true }
    })

    return NextResponse.json({ 
      success: true,
      sessionId: connectionLog.id,  // ID de la session pour le tracking
      connectionLog: {
        id: connectionLog.id,
        connectedAt: connectionLog.createdAt
      },
      stats: {
        connectionsToday,
        totalConnections,
        dayCounterIncremented: incrementedDay,
        currentStreak: newStreak,
        bestStreak: userStats?.longestStreak || 0
      },
      message: incrementedDay 
        ? `🔥 ${newStreak} jour${newStreak > 1 ? 's' : ''} consécutif${newStreak > 1 ? 's' : ''} ! ${connectionsToday} connexion(s) aujourd'hui.` 
        : `${connectionsToday} connexion(s) aujourd'hui`
    })
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
