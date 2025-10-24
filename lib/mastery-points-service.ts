import { prisma } from '@/lib/prisma'

/**
 * Service de gestion des Points de Maîtrise Universelle (PMU)
 * 
 * Les PMU récompensent toutes les activités de l'élève :
 * - Complétion de vidéos
 * - Scores aux QCM
 * - Obtention de badges
 * - Séries de connexions
 */

interface MasteryPointsConfig {
  VIDEO_COMPLETION: number        // 100% vidéo
  VIDEO_PARTIAL: number           // Par % de progression
  QCM_PERFECT: number            // 100% au QCM
  QCM_GOOD: number               // 80-99% au QCM
  QCM_PASS: number               // 50-79% au QCM
  EXERCISE_COMPLETION: number    // Exercice complété
  BADGE_COMMON: number           // Badge commun
  BADGE_RARE: number             // Badge rare
  BADGE_EPIC: number             // Badge épique
  BADGE_LEGENDARY: number        // Badge légendaire
  BADGE_SECRET: number           // Badge secret
  DAILY_STREAK_BONUS: number    // Par jour de streak
}

const PMU_CONFIG: MasteryPointsConfig = {
  VIDEO_COMPLETION: 100,
  VIDEO_PARTIAL: 1, // 1 point par %
  QCM_PERFECT: 200,
  QCM_GOOD: 150,
  QCM_PASS: 100,
  EXERCISE_COMPLETION: 80,
  BADGE_COMMON: 50,
  BADGE_RARE: 150,
  BADGE_EPIC: 300,
  BADGE_LEGENDARY: 500,
  BADGE_SECRET: 1000,
  DAILY_STREAK_BONUS: 10
}

export class MasteryPointsService {
  /**
   * Calcule les points pour une vidéo complétée
   */
  static calculateVideoPoints(progressPercent: number): number {
    if (progressPercent >= 95) {
      return PMU_CONFIG.VIDEO_COMPLETION
    }
    return Math.floor(progressPercent * PMU_CONFIG.VIDEO_PARTIAL)
  }

  /**
   * Calcule les points pour un QCM
   */
  static calculateQcmPoints(scorePercent: number): number {
    if (scorePercent === 100) return PMU_CONFIG.QCM_PERFECT
    if (scorePercent >= 80) return PMU_CONFIG.QCM_GOOD
    if (scorePercent >= 50) return PMU_CONFIG.QCM_PASS
    return 0
  }

  /**
   * Calcule les points pour un exercice complété
   */
  static calculateExercisePoints(): number {
    return PMU_CONFIG.EXERCISE_COMPLETION
  }

  /**
   * Calcule les points pour un badge
   */
  static calculateBadgePoints(rarity: string): number {
    switch (rarity) {
      case 'legendary': return PMU_CONFIG.BADGE_LEGENDARY
      case 'epic': return PMU_CONFIG.BADGE_EPIC
      case 'rare': return PMU_CONFIG.BADGE_RARE
      case 'secret': return PMU_CONFIG.BADGE_SECRET
      default: return PMU_CONFIG.BADGE_COMMON
    }
  }

  /**
   * Calcule le bonus de streak quotidien
   */
  static calculateStreakBonus(streakDays: number): number {
    return streakDays * PMU_CONFIG.DAILY_STREAK_BONUS
  }

  /**
   * Ajoute des points de maîtrise à un utilisateur
   */
  static async addMasteryPoints(
    userId: string, 
    points: number, 
    reason: string
  ) {
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalMasteryPoints: true,
        monthlyMasteryPoints: true,
        weeklyMasteryPoints: true,
        lastMonthlyReset: true,
        lastWeeklyReset: true
      }
    })

    if (!user) return null

    // Vérifier et réinitialiser les compteurs si nécessaire
    const now = new Date()
    const resetData = this.checkAndResetPeriods(
      now,
      user.lastMonthlyReset,
      user.lastWeeklyReset
    )

    // Mettre à jour les points
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        totalMasteryPoints: user.totalMasteryPoints + points,
        monthlyMasteryPoints: resetData.resetMonthly 
          ? points 
          : user.monthlyMasteryPoints + points,
        weeklyMasteryPoints: resetData.resetWeekly 
          ? points 
          : user.weeklyMasteryPoints + points,
        lastMonthlyReset: resetData.resetMonthly ? now : user.lastMonthlyReset,
        lastWeeklyReset: resetData.resetWeekly ? now : user.lastWeeklyReset
      }
    })

    console.log(`[PMU] ${points} points ajoutés pour ${userId} - Raison: ${reason}`)

    // Vérifier si l'utilisateur a débloqué un nouveau titre
    await this.updateUserTitle(userId, updated.totalMasteryPoints)

    return updated
  }

  /**
   * Vérifie si les périodes doivent être réinitialisées
   */
  private static checkAndResetPeriods(
    now: Date,
    lastMonthlyReset: Date | null,
    lastWeeklyReset: Date | null
  ) {
    const resetMonthly = !lastMonthlyReset || 
      (now.getMonth() !== lastMonthlyReset.getMonth() || 
       now.getFullYear() !== lastMonthlyReset.getFullYear())

    const resetWeekly = !lastWeeklyReset || 
      this.getWeekNumber(now) !== this.getWeekNumber(lastWeeklyReset)

    return { resetMonthly, resetWeekly }
  }

  /**
   * Obtient le numéro de semaine
   */
  private static getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  /**
   * Met à jour le titre de l'utilisateur selon ses PMU
   */
  private static async updateUserTitle(userId: string, totalPMU: number) {
    const newTitle = this.determineTitleFromPMU(totalPMU)
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        currentTitle: true,
        email: true,
        name: true,
        emailsNotification: true
      }
    })

    if (user && user.currentTitle !== newTitle) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentTitle: newTitle }
      })

      console.log(`[TITRE] Nouveau titre pour ${userId}: ${newTitle}`)

      // Envoyer un email de félicitations pour le nouveau titre
      try {
        const { EmailService } = await import('./email-service')
        await EmailService.sendTitleUnlocked(
          user.email || '',
          user.name || 'Élève',
          newTitle,
          totalPMU,
          user.emailsNotification || []
        )
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de nouveau titre:', error)
      }
    }
  }

  /**
   * Détermine le titre basé sur les PMU totaux
   */
  private static determineTitleFromPMU(pmu: number): string {
    if (pmu >= 50000) return '👑 Grand Maître Master Maths'
    if (pmu >= 30000) return '🏆 Maître Suprême'
    if (pmu >= 20000) return '⚡ Virtuose des Mathématiques'
    if (pmu >= 15000) return '🎯 Expert Confirmé'
    if (pmu >= 10000) return '🌟 Maître des Équations'
    if (pmu >= 7500) return '💎 Mathématicien d\'Élite'
    if (pmu >= 5000) return '🔥 Calculateur Accompli'
    if (pmu >= 3000) return '📐 Géomètre Talentueux'
    if (pmu >= 2000) return '✨ Algébriste Prometteur'
    if (pmu >= 1000) return '🎓 Étudiant Dévoué'
    if (pmu >= 500) return '📚 Apprenti Avancé'
    if (pmu >= 100) return '🌱 Apprenti Mathématicien'
    return '🔰 Novice'
  }

  /**
   * Récupère le classement historique (Top 100)
   */
  static async getHistoricalLeaderboard(limit: number = 100) {
    return await prisma.user.findMany({
      where: {
        status: { in: ['DEMO', 'PREMIUM'] }
      },
      select: {
        id: true,
        name: true,
        currentTitle: true,
        totalMasteryPoints: true,
        currentStreak: true,
        user_badges: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        totalMasteryPoints: 'desc'
      },
      take: limit
    })
  }

  /**
   * Récupère le classement mensuel
   */
  static async getMonthlyLeaderboard(limit: number = 100) {
    return await prisma.user.findMany({
      where: {
        status: { in: ['DEMO', 'PREMIUM'] }
      },
      select: {
        id: true,
        name: true,
        currentTitle: true,
        monthlyMasteryPoints: true,
        totalMasteryPoints: true
      },
      orderBy: {
        monthlyMasteryPoints: 'desc'
      },
      take: limit
    })
  }

  /**
   * Récupère le classement hebdomadaire
   */
  static async getWeeklyLeaderboard(limit: number = 100) {
    return await prisma.user.findMany({
      where: {
        status: { in: ['DEMO', 'PREMIUM'] }
      },
      select: {
        id: true,
        name: true,
        currentTitle: true,
        weeklyMasteryPoints: true,
        totalMasteryPoints: true
      },
      orderBy: {
        weeklyMasteryPoints: 'desc'
      },
      take: limit
    })
  }

  /**
   * Vérifie si un utilisateur est dans le Top 5% mensuel
   */
  static async checkTopMonthlyPercentile(userId: string): Promise<boolean> {
    const allUsers = await prisma.user.findMany({
      where: { status: { in: ['DEMO', 'PREMIUM'] } },
      select: { id: true, monthlyMasteryPoints: true },
      orderBy: { monthlyMasteryPoints: 'desc' }
    })

    const userRank = allUsers.findIndex(u => u.id === userId)
    if (userRank === -1) return false

    const top5PercentThreshold = Math.ceil(allUsers.length * 0.05)
    return userRank < top5PercentThreshold
  }

  /**
   * Vérifie si un utilisateur est dans le Top 10 historique
   */
  static async checkTopHistorical(userId: string): Promise<boolean> {
    const top10 = await this.getHistoricalLeaderboard(10)
    return top10.some(u => u.id === userId)
  }

  /**
   * Marque les utilisateurs éligibles pour le cours gratuit
   */
  static async updateFreeCourseEligibility() {
    // Top 10 historique
    const top10Historical = await this.getHistoricalLeaderboard(10)
    
    // Top 5% mensuel
    const allUsers = await prisma.user.findMany({
      where: { status: { in: ['DEMO', 'PREMIUM'] } },
      select: { id: true, monthlyMasteryPoints: true },
      orderBy: { monthlyMasteryPoints: 'desc' }
    })
    
    const top5PercentCount = Math.ceil(allUsers.length * 0.05)
    const top5PercentUsers = allUsers.slice(0, top5PercentCount)

    const eligibleUserIds = new Set([
      ...top10Historical.map(u => u.id),
      ...top5PercentUsers.map(u => u.id)
    ])

    // TODO: Réactiver quand le champ hasFreeCourseReward sera ajouté au schéma
    // Mettre à jour tous les utilisateurs
    // await prisma.user.updateMany({
    //   where: { id: { in: Array.from(eligibleUserIds) } },
    //   data: { hasFreeCourseReward: true }
    // })

    // await prisma.user.updateMany({
    //   where: { id: { notIn: Array.from(eligibleUserIds) } },
    //   data: { hasFreeCourseReward: false }
    // })

    return {
      eligible: eligibleUserIds.size,
      top10: top10Historical.length,
      top5Percent: top5PercentUsers.length
    }
  }
}


