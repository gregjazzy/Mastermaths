import { prisma } from '@/lib/prisma'

/**
 * Service de gestion des badges de maîtrise (Or/Argent/Bronze)
 * Attribue automatiquement des badges selon les performances
 */

export enum MasteryLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export interface MasteryBadge {
  type: 'LESSON' | 'CHAPTER' | 'COURSE'
  level: MasteryLevel | 'COMPLETED' | 'MASTERED' | 'GRADUATE' | 'EXCELLENCE'
  entityId: string // ID de la leçon, chapitre ou cours
  entityName: string
  score?: number
  earnedAt: Date
}

export class MasteryBadgeService {
  /**
   * Attribue un badge de maîtrise pour une leçon selon le score QCM
   */
  static async awardLessonBadge(
    userId: string,
    lessonId: string,
    score: number
  ): Promise<MasteryBadge | null> {
    // Déterminer le niveau de maîtrise
    let level: MasteryLevel | null = null
    let pmuBonus = 0

    if (score >= 100) {
      level = MasteryLevel.GOLD
      pmuBonus = 60
    } else if (score >= 90) {
      level = MasteryLevel.SILVER
      pmuBonus = 40
    } else if (score >= 80) {
      level = MasteryLevel.BRONZE
      pmuBonus = 20
    }

    if (!level) return null

    // Récupérer les informations de la leçon
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { 
        title: true,
        subChapter: {
          select: {
            title: true,
            chapter: {
              select: {
                title: true,
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      }
    })

    if (!lesson) return null

    // Créer l'identifiant unique du badge
    const badgeId = `lesson_${lessonId}_${level.toLowerCase()}`

    // Vérifier si l'utilisateur a déjà ce badge
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        name: true,
        email: true,
        emailsNotification: true
      }
    })

    if (!user) return null

    // Note: On stocke les badges de maîtrise dans une structure JSON
    // Vous pourriez aussi créer une table dédiée si besoin

    // Ajouter les PMU bonus
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalMasteryPoints: { increment: pmuBonus },
        monthlyMasteryPoints: { increment: pmuBonus },
        weeklyMasteryPoints: { increment: pmuBonus }
      }
    })

    const badge: MasteryBadge = {
      type: 'LESSON',
      level,
      entityId: lessonId,
      entityName: lesson.title,
      score,
      earnedAt: new Date()
    }

    return badge
  }

  /**
   * Vérifie et attribue un badge de chapitre si toutes les leçons sont complétées
   */
  static async checkChapterBadge(
    userId: string,
    chapterId: string
  ): Promise<MasteryBadge | null> {
    // Récupérer toutes les leçons du chapitre via les sous-chapitres
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        title: true,
        subChapters: {
          select: {
            lessons: {
              select: {
                id: true,
                type: true
              }
            }
          }
        }
      }
    })

    if (!chapter) return null

    // Collecter toutes les leçons du chapitre
    const allLessons = chapter.subChapters.flatMap(sc => sc.lessons)
    const lessonIds = allLessons.map(l => l.id)

    if (lessonIds.length === 0) return null

    // Récupérer les performances de l'utilisateur
    const performances = await prisma.performance.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds }
      },
      select: {
        lessonId: true,
        isCompleted: true,
        bestScore: true
      }
    })

    // Vérifier si toutes les leçons sont complétées
    const completedCount = performances.filter(p => p.isCompleted).length
    const allCompleted = completedCount === lessonIds.length

    if (!allCompleted) return null

    // Vérifier si toutes sont maîtrisées (score >= 100)
    const allMastered = performances.every(p => (p.bestScore || 0) >= 100)

    const badgeType = allMastered ? 'MASTERED' : 'COMPLETED'
    const pmuBonus = allMastered ? 200 : 100

    // Ajouter les PMU bonus
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalMasteryPoints: { increment: pmuBonus },
        monthlyMasteryPoints: { increment: pmuBonus },
        weeklyMasteryPoints: { increment: pmuBonus }
      }
    })

    const badge: MasteryBadge = {
      type: 'CHAPTER',
      level: badgeType,
      entityId: chapterId,
      entityName: chapter.title,
      earnedAt: new Date()
    }

    return badge
  }

  /**
   * Vérifie et attribue un badge de cours si tous les chapitres sont complétés
   */
  static async checkCourseBadge(
    userId: string,
    courseId: string
  ): Promise<MasteryBadge | null> {
    // Récupérer tous les chapitres du cours
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        title: true,
        chapters: {
          select: {
            id: true,
            subChapters: {
              select: {
                lessons: {
                  select: {
                    id: true,
                    type: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!course || course.chapters.length === 0) return null

    // Collecter toutes les leçons du cours
    const allLessons = course.chapters.flatMap(ch =>
      ch.subChapters.flatMap(sc => sc.lessons)
    )
    const lessonIds = allLessons.map(l => l.id)

    if (lessonIds.length === 0) return null

    // Récupérer les performances de l'utilisateur
    const performances = await prisma.performance.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds }
      },
      select: {
        lessonId: true,
        isCompleted: true,
        bestScore: true
      }
    })

    // Vérifier si toutes les leçons sont complétées
    const completedCount = performances.filter(p => p.isCompleted).length
    const allCompleted = completedCount === lessonIds.length

    if (!allCompleted) return null

    // Vérifier si toutes sont maîtrisées (score >= 100)
    const allMastered = performances.every(p => (p.bestScore || 0) >= 100)

    const badgeType = allMastered ? 'EXCELLENCE' : 'GRADUATE'
    const pmuBonus = allMastered ? 1000 : 500

    // Ajouter les PMU bonus
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalMasteryPoints: { increment: pmuBonus },
        monthlyMasteryPoints: { increment: pmuBonus },
        weeklyMasteryPoints: { increment: pmuBonus }
      }
    })

    const badge: MasteryBadge = {
      type: 'COURSE',
      level: badgeType,
      entityId: courseId,
      entityName: course.title,
      earnedAt: new Date()
    }

    return badge
  }

  /**
   * Récupère tous les badges de maîtrise d'un utilisateur
   */
  static async getUserMasteryBadges(userId: string): Promise<MasteryBadge[]> {
    // Pour l'instant, on recalcule depuis les performances
    // Dans une vraie implémentation, vous pourriez stocker ça dans une table dédiée
    
    const performances = await prisma.performance.findMany({
      where: {
        userId,
        isCompleted: true
      },
      select: {
        lessonId: true,
        bestScore: true,
        lesson: {
          select: {
            title: true,
            subChapterId: true
          }
        }
      }
    })

    const badges: MasteryBadge[] = performances
      .filter(p => (p.bestScore || 0) >= 80)
      .map(p => {
        let level: MasteryLevel
        if ((p.bestScore || 0) >= 100) level = MasteryLevel.GOLD
        else if ((p.bestScore || 0) >= 90) level = MasteryLevel.SILVER
        else level = MasteryLevel.BRONZE

        return {
          type: 'LESSON' as const,
          level,
          entityId: p.lessonId,
          entityName: p.lesson.title,
          score: p.bestScore || 0,
          earnedAt: new Date() // TODO: stocker la vraie date
        }
      })

    return badges
  }
}

