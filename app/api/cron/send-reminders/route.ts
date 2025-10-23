import { NextResponse } from 'next/server'
import { ConnectionService } from '@/lib/connection-service'
import { EmailService } from '@/lib/email-service'

/**
 * API pour envoyer des rappels aux utilisateurs inactifs
 * À appeler via un cron job quotidien
 */

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification par token (pour sécuriser le cron)
    const authHeader = req.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer les utilisateurs inactifs depuis 2 jours (48h)
    const inactiveUsers = await ConnectionService.getInactiveUsers(2)

    const results = []

    for (const user of inactiveUsers) {
      // Calculer le nombre de jours d'inactivité
      const lastConnection = user.lastConnectionDate ? new Date(user.lastConnectionDate) : null
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let daysInactive = 0
      if (lastConnection) {
        lastConnection.setHours(0, 0, 0, 0)
        const diffTime = today.getTime() - lastConnection.getTime()
        daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      }

      // Envoyer l'email de rappel
      const emailResult = await EmailService.sendInactivityReminder(
        user.email,
        user.name || 'Étudiant',
        daysInactive,
        user.emailsNotification
      )

      if (emailResult.success) {
        // Marquer que le rappel a été envoyé
        await ConnectionService.markReminderSent(user.id)
      }

      results.push({
        userId: user.id,
        email: user.email,
        daysInactive,
        emailSent: emailResult.success
      })
    }

    return NextResponse.json({
      success: true,
      remindersSent: results.filter(r => r.emailSent).length,
      totalInactive: inactiveUsers.length,
      results
    })
  } catch (error) {
    console.error('Erreur lors de l\'envoi des rappels:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET pour tester manuellement (en dev uniquement)
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Endpoint disponible uniquement en développement' },
      { status: 403 }
    )
  }

  const inactiveUsers = await ConnectionService.getInactiveUsers(2)

  return NextResponse.json({
    inactiveUsers: inactiveUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      lastConnection: u.lastConnectionDate,
      streak: u.connectionStreak
    }))
  })
}

