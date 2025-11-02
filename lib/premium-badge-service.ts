import { prisma } from '@/lib/prisma'

/**
 * Service de gestion des badges Premium (style Pokémon)
 * Attribution basée sur la complétion totale d'une leçon (vidéo + QCM + exercices)
 */

export type PremiumBadgeLevel = 'APPRENTI' | 'CONFIRME' | 'EXPERT' | 'MAITRE' | 'VIRTUOSE'

interface PremiumBadge {
  id: string
  name: string
  level: PremiumBadgeLevel
  chapterId: string
  chapterName: string
  earnedAt: Date
}

export class PremiumBadgeService {
  /**
   * Vérifie si une leçon est 100% complète (vidéo + QCM leçon + tous exercices)
   */
  static async isLessonFullyCompleted(userId: string, lessonId: string): Promise<boolean> {
    // 1. Vérifier la performance de la leçon (vidéo + QCM leçon)
    const lessonPerf = await prisma.performance.findFirst({
      where: {
        userId,
        lessonId
      }
    })

    if (!lessonPerf) return false

    // Vidéo regardée à 95% minimum
    const videoWatched = lessonPerf.videoProgressPercent >= 95
    
    // QCM leçon réussi à 80% minimum (si le QCM existe)
    const qcmPassed = lessonPerf.quizScorePercent === null || lessonPerf.quizScorePercent >= 80

    // 2. Récupérer tous les exercices de la leçon
    const exercises = await prisma.exercise.findMany({
      where: { lessonId }
    })

    // Si pas d'exercices, la leçon est complète si vidéo + QCM ok
    if (exercises.length === 0) {
      return videoWatched && qcmPassed
    }

    // 3. Vérifier que TOUS les exercices sont complétés avec score ≥ 80%
    const exercisePerfs = await prisma.performance.findMany({
      where: {
        userId,
        exerciseId: { in: exercises.map(e => e.id) }
      }
    })

    // Tous les exercices doivent être complétés
    if (exercisePerfs.length !== exercises.length) return false

    // Tous les exercices doivent avoir un score ≥ 80%
    const allExercisesCompleted = exercisePerfs.every(
      perf => perf.quizScorePercent !== null && perf.quizScorePercent >= 80
    )

    // ✅ Leçon 100% complète
    return videoWatched && qcmPassed && allExercisesCompleted
  }

  /**
   * Compte le nombre de leçons complètes dans un chapitre
   */
  static async countCompletedLessonsInChapter(userId: string, chapterId: string): Promise<number> {
    // Récupérer toutes les leçons du chapitre
    const lessons = await prisma.lesson.findMany({
      where: {
        subChapter: {
          chapterId
        }
      },
      select: { id: true }
    })

    // Vérifier chaque leçon
    let completedCount = 0
    for (const lesson of lessons) {
      const isComplete = await this.isLessonFullyCompleted(userId, lesson.id)
      if (isComplete) completedCount++
    }

    return completedCount
  }

  /**
   * Détermine le niveau de badge selon le nombre de leçons complètes
   */
  static getBadgeLevelForCount(count: number): PremiumBadgeLevel | null {
    if (count >= 5) return 'VIRTUOSE'
    if (count >= 4) return 'MAITRE'
    if (count >= 3) return 'EXPERT'
    if (count >= 2) return 'CONFIRME'
    if (count >= 1) return 'APPRENTI'
    return null
  }

  /**
   * Vérifie et attribue le badge Premium approprié
   * Appelé après chaque complétion de leçon/exercice
   */
  static async checkAndAwardPremiumBadge(
    userId: string,
    chapterId: string
  ): Promise<PremiumBadge | null> {
    // Compter les leçons complètes
    const completedCount = await this.countCompletedLessonsInChapter(userId, chapterId)

    // Déterminer le niveau de badge
    const level = this.getBadgeLevelForCount(completedCount)
    if (!level) return null

    // Récupérer les infos du chapitre
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { title: true }
    })

    if (!chapter) return null

    // Construire l'ID du badge
    const badgeId = `badge_${chapterId}_${level.toLowerCase()}`

    // Vérifier si le badge existe dans la table badges
    let badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    })

    // Si le badge n'existe pas, le créer (pour le développement)
    if (!badge) {
      console.warn(`Badge Premium ${badgeId} n'existe pas encore, création...`)
      // Note: En production, tous les badges doivent être créés via l'admin
      return null
    }

    // Vérifier si l'utilisateur a déjà ce badge
    const existingUserBadge = await prisma.user_badges.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId
        }
      }
    })

    if (existingUserBadge) {
      // Badge déjà attribué
      return null
    }

    // Attribuer le badge
    await prisma.user_badges.create({
      data: {
        id: `${userId}_${badgeId}`,
        userId,
        badgeId,
        unlockedAt: new Date()
      }
    })

    // Ajouter les PMU à l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalMasteryPoints: { increment: badge.masteryPoints },
        monthlyMasteryPoints: { increment: badge.masteryPoints },
        weeklyMasteryPoints: { increment: badge.masteryPoints }
      }
    })

    console.log(`✅ Badge Premium attribué : ${badge.name} (+${badge.masteryPoints} PMU)`)

    // Retourner les infos du badge attribué
    return {
      id: badge.id,
      name: badge.name,
      level,
      chapterId,
      chapterName: chapter.title,
      earnedAt: new Date()
    }
  }

  /**
   * Récupère tous les badges Premium d'un utilisateur
   */
  static async getUserPremiumBadges(userId: string): Promise<PremiumBadge[]> {
    const userBadges = await prisma.user_badges.findMany({
      where: {
        userId,
        badges: {
          type: 'CHAPTER_PREMIUM'
        }
      },
      include: {
        badges: {
          include: {
            // Pas de relation directe, on va chercher le chapitre via le chapterId stocké
          }
        }
      },
      orderBy: {
        unlockedAt: 'desc'
      }
    })

    // Transformer en format PremiumBadge
    const premiumBadges: PremiumBadge[] = []
    
    for (const ub of userBadges) {
      // Extraire le niveau depuis le nom du badge
      const levelMatch = ub.badges.name.match(/(APPRENTI|CONFIRMÉ|EXPERT|MAÎTRE|VIRTUOSE)/)
      const level = levelMatch ? levelMatch[1] : 'APPRENTI'
      
      // Note: Le chapterId devrait être stocké dans le badge
      // Pour l'instant on l'extrait de l'ID du badge
      const chapterIdMatch = ub.badges.id.match(/badge_(.+?)_(apprenti|confirme|expert|maitre|virtuose)/)
      const chapterId = chapterIdMatch ? chapterIdMatch[1] : ''

      if (chapterId) {
        const chapter = await prisma.chapter.findUnique({
          where: { id: chapterId },
          select: { title: true }
        })

        premiumBadges.push({
          id: ub.badges.id,
          name: ub.badges.name,
          level: level.replace('É', 'E').toUpperCase() as PremiumBadgeLevel,
          chapterId,
          chapterName: chapter?.title || 'Chapitre',
          earnedAt: ub.unlockedAt
        })
      }
    }

    return premiumBadges
  }

  /**
   * Récupère la progression des badges Premium pour un chapitre
   */
  static async getChapterProgress(userId: string, chapterId: string): Promise<{
    completedLessons: number
    totalLessons: number
    currentLevel: PremiumBadgeLevel | null
    nextLevel: PremiumBadgeLevel | null
  }> {
    // Compter les leçons complètes
    const completedLessons = await this.countCompletedLessonsInChapter(userId, chapterId)

    // Compter le total de leçons
    const totalLessons = await prisma.lesson.count({
      where: {
        subChapter: {
          chapterId
        }
      }
    })

    // Niveau actuel
    const currentLevel = this.getBadgeLevelForCount(completedLessons)

    // Niveau suivant
    const nextLevel = this.getBadgeLevelForCount(completedLessons + 1)

    return {
      completedLessons,
      totalLessons,
      currentLevel,
      nextLevel
    }
  }
}

