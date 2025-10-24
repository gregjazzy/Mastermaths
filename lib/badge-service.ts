import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email-service'

/**
 * Service de gestion des badges
 * Évalue les critères et déverrouille les badges pour les utilisateurs
 */

interface BadgeCriteria {
  connection_days_count?: number
  quiz_success_rate?: number
  lessons_completed?: number
  perfect_qcm_count?: number
  video_completion_rate?: number
  streak_days?: number
}

export class BadgeService {
  /**
   * Évalue tous les badges pour un utilisateur donné
   */
  static async evaluateUserBadges(userId: string): Promise<string[]> {
    const newBadges: string[] = []

    // Récupérer l'utilisateur avec ses badges actuels via la relation user_badges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        user_badges: {
          select: {
            badgeId: true
          }
        }
      }
    })

    if (!user) return []

    const userBadgeIds = user.user_badges.map(ub => ub.badgeId)

    // Récupérer tous les badges disponibles
    const allBadges = await prisma.badge.findMany({
      orderBy: { name: 'asc' }
    })

    // Récupérer les statistiques de l'utilisateur
    const stats = await this.getUserStats(userId)

    // Évaluer chaque badge
    for (const badge of allBadges) {
      // Si le badge est déjà déverrouillé, ignorer
      if (userBadgeIds.includes(badge.id)) {
        continue
      }

      // TODO: Implémenter l'évaluation des critères de badges
      // Pour l'instant, les badges sont attribués manuellement ou via le système de maîtrise
    }

    return newBadges
  }

  /**
   * Récupère les statistiques d'un utilisateur
   */
  private static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    const performances = await prisma.performance.findMany({
      where: { userId },
      include: { lesson: true }
    })

    // Calculer les statistiques
    const totalLessons = performances.length
    const completedLessons = performances.filter(p => 
      p.isCompleted || p.videoProgressPercent >= 95 || (p.quizScorePercent && p.quizScorePercent >= 50)
    ).length

    const qcmPerformances = performances.filter(p => p.quizScorePercent !== null)
    const perfectQcms = qcmPerformances.filter(p => p.quizScorePercent === 100).length
    const avgQcmScore = qcmPerformances.length > 0
      ? qcmPerformances.reduce((sum, p) => sum + (p.quizScorePercent || 0), 0) / qcmPerformances.length
      : 0

    const videoPerformances = performances.filter(p => 
      p.lesson.type === 'VIDEO_COURS' || p.lesson.type === 'CORRECTION_VIDEO'
    )
    const avgVideoCompletion = videoPerformances.length > 0
      ? videoPerformances.reduce((sum, p) => sum + p.videoProgressPercent, 0) / videoPerformances.length
      : 0

    return {
      connection_days_count: user?.connectionDaysCount || 0,
      lessons_completed: completedLessons,
      quiz_success_rate: avgQcmScore,
      perfect_qcm_count: perfectQcms,
      video_completion_rate: avgVideoCompletion,
      total_lessons: totalLessons
    }
  }

  /**
   * Évalue si les critères d'un badge sont remplis
   */
  private static evaluateCriteria(criteria: BadgeCriteria, stats: any): boolean {
    // Vérifier chaque critère
    if (criteria.connection_days_count !== undefined) {
      if (stats.connection_days_count < criteria.connection_days_count) {
        return false
      }
    }

    if (criteria.quiz_success_rate !== undefined) {
      if (stats.quiz_success_rate < criteria.quiz_success_rate) {
        return false
      }
    }

    if (criteria.lessons_completed !== undefined) {
      if (stats.lessons_completed < criteria.lessons_completed) {
        return false
      }
    }

    if (criteria.perfect_qcm_count !== undefined) {
      if (stats.perfect_qcm_count < criteria.perfect_qcm_count) {
        return false
      }
    }

    if (criteria.video_completion_rate !== undefined) {
      if (stats.video_completion_rate < criteria.video_completion_rate) {
        return false
      }
    }

    // Tous les critères sont remplis
    return true
  }

  /**
   * Incrémente le compteur de connexion si c'est un nouveau jour
   */
  static async incrementConnectionDaysCount(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastConnectionDate: true }
    })

    if (!user) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastConnection = user.lastConnectionDate
      ? new Date(user.lastConnectionDate)
      : null

    if (lastConnection) {
      lastConnection.setHours(0, 0, 0, 0)
    }

    // Si c'est un nouveau jour
    if (!lastConnection || lastConnection.getTime() !== today.getTime()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastConnectionDate: new Date()
        }
      })

      // Évaluer les badges après l'incrémentation
      await this.evaluateUserBadges(userId)

      return true
    }

    return false
  }

  /**
   * Récupère les badges d'un utilisateur avec leurs détails
   */
  static async getUserBadges(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { badgesUnlocked: true }
    })

    if (!user || user.badgesUnlocked.length === 0) {
      return []
    }

    const badges = await prisma.badge.findMany({
      where: {
        id: {
          in: user.badgesUnlocked
        }
      },
      orderBy: { order: 'asc' }
    })

    return badges
  }
}

