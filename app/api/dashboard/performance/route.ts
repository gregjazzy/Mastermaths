import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'
export const dynamic = 'force-dynamic'


export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer tous les cours accessibles avec les performances
    const courses = await prisma.course.findMany({
      where: user.status === 'PREMIUM' 
        ? {} 
        : { isDemoContent: true },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            subChapters: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  include: {
                    performances: {
                      where: { userId: user.id },
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    // Calculer les statistiques de performance
    const coursesWithPerformance = courses.map(course => {
      const chapters = course.chapters.map(chapter => {
        const subChapters = chapter.subChapters.map(subChapter => {
          const lessons = subChapter.lessons.map(lesson => {
            const performance = lesson.performances[0]
            
            return {
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              lessonType: lesson.type,
              videoProgressPercent: performance?.videoProgressPercent || 0,
              quizScorePercent: performance?.quizScorePercent || null,
              isCompleted: performance?.isCompleted || false,
              hasViewedCorrection: performance?.hasViewedCorrection || false,
            }
          })

          // Calculer la complétion du sous-chapitre
          const completionSum = lessons.reduce((sum, l) => {
            if (l.isCompleted) return sum + 100
            if (l.lessonType === 'VIDEO_COURS' || l.lessonType === 'CORRECTION_VIDEO') {
              return sum + l.videoProgressPercent
            }
            if (l.lessonType === 'QCM' && l.quizScorePercent !== null) {
              return sum + l.quizScorePercent
            }
            return sum
          }, 0)
          
          const completionPercent = lessons.length > 0 ? completionSum / lessons.length : 0

          return {
            subChapterId: subChapter.id,
            subChapterTitle: subChapter.title,
            lessons,
            completionPercent,
          }
        })

        // Calculer la complétion du chapitre
        const chapterCompletion = subChapters.length > 0
          ? subChapters.reduce((sum, sc) => sum + sc.completionPercent, 0) / subChapters.length
          : 0

        return {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          subChapters,
          completionPercent: chapterCompletion,
        }
      })

      // Calculer la complétion globale du cours
      const overallCompletion = chapters.length > 0
        ? chapters.reduce((sum, ch) => sum + ch.completionPercent, 0) / chapters.length
        : 0

      return {
        courseId: course.id,
        courseTitle: course.title,
        chapters,
        overallCompletion,
      }
    })

    return NextResponse.json({ courses: coursesWithPerformance })
  } catch (error) {
    console.error('Erreur lors de la récupération des performances:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


