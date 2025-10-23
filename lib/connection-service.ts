import { prisma } from '@/lib/prisma'

/**
 * Service de gestion des connexions et streaks
 */

export class ConnectionService {
  /**
   * Calcule et met à jour le streak de connexion
   * Retourne le nouveau streak
   */
  static async updateConnectionStreak(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        lastConnectionDate: true,
        connectionStreak: true,
        bestStreak: true
      }
    })

    if (!user) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newStreak = 1 // Par défaut, 1 jour

    if (user.lastConnectionDate) {
      const lastConnection = new Date(user.lastConnectionDate)
      lastConnection.setHours(0, 0, 0, 0)

      // Si connexion hier : continuer le streak
      if (lastConnection.getTime() === yesterday.getTime()) {
        newStreak = user.connectionStreak + 1
      }
      // Si connexion aujourd'hui déjà : garder le streak actuel
      else if (lastConnection.getTime() === today.getTime()) {
        newStreak = user.connectionStreak
      }
      // Sinon : réinitialiser à 1
      else {
        newStreak = 1
      }
    }

    // Mettre à jour le meilleur streak si dépassé
    const newBestStreak = Math.max(newStreak, user.bestStreak)

    await prisma.user.update({
      where: { id: userId },
      data: {
        connectionStreak: newStreak,
        bestStreak: newBestStreak,
      }
    })

    return newStreak
  }

  /**
   * Récupère les utilisateurs inactifs depuis X jours
   */
  static async getInactiveUsers(daysInactive: number = 3) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive)
    cutoffDate.setHours(0, 0, 0, 0)

    const inactiveUsers = await prisma.user.findMany({
      where: {
        AND: [
          // A une date de dernière connexion
          { lastConnectionDate: { not: null } },
          // Dernière connexion avant la date limite
          { lastConnectionDate: { lt: cutoffDate } },
          // Pas de rappel envoyé aujourd'hui
          {
            OR: [
              { lastReminderSentAt: null },
              { lastReminderSentAt: { lt: cutoffDate } }
            ]
          },
          // Utilisateur actif (DEMO ou PREMIUM)
          { status: { in: ['DEMO', 'PREMIUM'] } }
        ]
      },
      select: {
        id: true,
        email: true,
        emailsNotification: true,
        name: true,
        lastConnectionDate: true,
        connectionStreak: true
      }
    })

    return inactiveUsers
  }

  /**
   * Marque qu'un email de rappel a été envoyé
   */
  static async markReminderSent(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastReminderSentAt: new Date() }
    })
  }

  /**
   * Récupère les statistiques de connexion d'un utilisateur
   */
  static async getUserConnectionStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        connectionDaysCount: true,
        connectionStreak: true,
        bestStreak: true,
        lastConnectionDate: true
      }
    })

    if (!user) return null

    // Calculer les jours d'inactivité
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let daysInactive = 0
    if (user.lastConnectionDate) {
      const lastConnection = new Date(user.lastConnectionDate)
      lastConnection.setHours(0, 0, 0, 0)
      const diffTime = today.getTime() - lastConnection.getTime()
      daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    }

    return {
      totalDays: user.connectionDaysCount,
      currentStreak: user.connectionStreak,
      bestStreak: user.bestStreak,
      lastConnection: user.lastConnectionDate,
      daysInactive
    }
  }
}


