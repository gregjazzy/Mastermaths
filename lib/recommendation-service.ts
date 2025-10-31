import { prisma } from '@/lib/prisma'

/**
 * Service de recommandations de leçons personnalisées
 * Trouve la prochaine leçon optimale pour l'utilisateur
 */

export interface RecommendedLesson {
  id: string
  title: string
  type: string
  courseId: string
  courseName: string
  chapterId: string
  chapterName: string
  subChapterId: string
  subChapterName: string
  reason: 'next_logical' | 'weak_area' | 'first_lesson'
  reasonText: string
}

export interface Recommendation {
  primary: RecommendedLesson | null
  review?: {
    lesson: RecommendedLesson
    averageScore: number
  }
}

/**
 * Obtenir la prochaine leçon recommandée pour l'utilisateur
 */
export async function getRecommendedLesson(userId: string): Promise<Recommendation> {
  try {
    // 1. Vérifier s'il y a des leçons complétées
    const lastCompleted = await prisma.performance.findFirst({
      where: { 
        userId,
        isCompleted: true 
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        lesson: {
          include: {
            subChapter: {
              include: {
                chapter: {
                  include: { course: true }
                }
              }
            }
          }
        }
      }
    })

    // 2. Si aucune leçon complétée → Première leçon du premier cours
    if (!lastCompleted) {
      const firstLesson = await getFirstLesson()
      if (!firstLesson) return { primary: null }

      return {
        primary: {
          ...firstLesson,
          reason: 'first_lesson',
          reasonText: '🎯 Commence ton aventure ici !'
        }
      }
    }

    // 3. Chercher la prochaine leçon dans l'ordre
    const nextLesson = await getNextLessonInOrder(lastCompleted.lesson)

    // 4. Chercher les leçons à réviser (score < 80%)
    const reviewLesson = await getLessonToReview(userId)

    return {
      primary: nextLesson ? {
        ...nextLesson,
        reason: 'next_logical',
        reasonText: '📚 Continue ta progression !'
      } : null,
      review: reviewLesson
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error)
    return { primary: null }
  }
}

/**
 * Obtenir la première leçon du premier cours
 */
async function getFirstLesson() {
  const firstLesson = await prisma.lesson.findFirst({
    where: {
      subChapter: {
        chapter: {
          course: {
            isDemoContent: false
          }
        }
      }
    },
    include: {
      subChapter: {
        include: {
          chapter: {
            include: { course: true }
          }
        }
      }
    },
    orderBy: [
      { subChapter: { chapter: { course: { order: 'asc' } } } },
      { subChapter: { chapter: { order: 'asc' } } },
      { subChapter: { order: 'asc' } },
      { order: 'asc' }
    ]
  })

  if (!firstLesson) return null

  return formatLesson(firstLesson)
}

/**
 * Obtenir la prochaine leçon dans l'ordre logique
 */
async function getNextLessonInOrder(currentLesson: any) {
  // 1. Chercher la leçon suivante dans le même sous-chapitre
  let nextLesson = await prisma.lesson.findFirst({
    where: {
      subChapterId: currentLesson.subChapterId,
      order: { gt: currentLesson.order }
    },
    include: {
      subChapter: {
        include: {
          chapter: {
            include: { course: true }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  if (nextLesson) return formatLesson(nextLesson)

  // 2. Chercher dans le sous-chapitre suivant
  const nextSubChapter = await prisma.subChapter.findFirst({
    where: {
      chapterId: currentLesson.subChapter.chapterId,
      order: { gt: currentLesson.subChapter.order }
    },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        take: 1,
        include: {
          subChapter: {
            include: {
              chapter: {
                include: { course: true }
              }
            }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  if (nextSubChapter?.lessons[0]) {
    return formatLesson(nextSubChapter.lessons[0])
  }

  // 3. Chercher dans le chapitre suivant
  const nextChapter = await prisma.chapter.findFirst({
    where: {
      courseId: currentLesson.subChapter.chapter.courseId,
      order: { gt: currentLesson.subChapter.chapter.order }
    },
    include: {
      subChapters: {
        orderBy: { order: 'asc' },
        take: 1,
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            take: 1,
            include: {
              subChapter: {
                include: {
                  chapter: {
                    include: { course: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  if (nextChapter?.subChapters[0]?.lessons[0]) {
    return formatLesson(nextChapter.subChapters[0].lessons[0])
  }

  // 4. Chercher dans le cours suivant
  const nextCourse = await prisma.course.findFirst({
    where: {
      order: { gt: currentLesson.subChapter.chapter.course.order },
      isDemoContent: false
    },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        take: 1,
        include: {
          subChapters: {
            orderBy: { order: 'asc' },
            take: 1,
            include: {
              lessons: {
                orderBy: { order: 'asc' },
                take: 1,
                include: {
                  subChapter: {
                    include: {
                      chapter: {
                        include: { course: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  const firstLessonOfNextCourse = nextCourse?.chapters[0]?.subChapters[0]?.lessons[0]
  if (firstLessonOfNextCourse) {
    return formatLesson(firstLessonOfNextCourse)
  }

  // Aucune leçon suivante trouvée
  return null
}

/**
 * Trouver une leçon à réviser (score < 80%)
 */
async function getLessonToReview(userId: string) {
  const weakPerformances = await prisma.performance.findMany({
    where: {
      userId,
      isCompleted: true,
      quizScorePercent: { not: null, lt: 80 }
    },
    include: {
      lesson: {
        include: {
          subChapter: {
            include: {
              chapter: {
                include: { course: true }
              }
            }
          }
        }
      }
    },
    orderBy: { quizScorePercent: 'asc' },
    take: 1
  })

  if (weakPerformances.length === 0) return undefined

  const performance = weakPerformances[0]

  return {
    lesson: {
      ...formatLesson(performance.lesson),
      reason: 'weak_area' as const,
      reasonText: `📊 Score actuel : ${performance.quizScorePercent?.toFixed(0)}%`
    },
    averageScore: performance.quizScorePercent || 0
  }
}

/**
 * Formater une leçon pour la recommandation
 */
function formatLesson(lesson: any): Omit<RecommendedLesson, 'reason' | 'reasonText'> {
  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    courseId: lesson.subChapter.chapter.course.id,
    courseName: lesson.subChapter.chapter.course.title,
    chapterId: lesson.subChapter.chapter.id,
    chapterName: lesson.subChapter.chapter.title,
    subChapterId: lesson.subChapter.id,
    subChapterName: lesson.subChapter.title
  }
}

/**
 * Obtenir des statistiques sur la progression de l'utilisateur
 */
export async function getUserProgressStats(userId: string) {
  const [totalLessons, completedLessons, averageScore] = await Promise.all([
    // Total de leçons disponibles
    prisma.lesson.count({
      where: {
        subChapter: {
          chapter: {
            course: {
              isDemoContent: false
            }
          }
        }
      }
    }),

    // Leçons complétées par l'utilisateur
    prisma.performance.count({
      where: {
        userId,
        isCompleted: true
      }
    }),

    // Score moyen
    prisma.performance.aggregate({
      where: {
        userId,
        quizScorePercent: { not: null }
      },
      _avg: { quizScorePercent: true }
    })
  ])

  return {
    totalLessons,
    completedLessons,
    completionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    averageScore: averageScore._avg.quizScorePercent || 0
  }
}

