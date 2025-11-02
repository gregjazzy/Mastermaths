import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'
import { MasteryBadgeService } from '@/lib/mastery-badge-service'
import { PremiumBadgeService } from '@/lib/premium-badge-service'
export const dynamic = 'force-dynamic'


export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const lessonId = params.lessonId
    const body = await req.json()
    const { score } = body // Score du QCM (0-100)

    // Récupérer la performance existante
    const existingPerformance = await prisma.performance.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      }
    })

    // Mettre à jour ou créer la performance
    const performance = await prisma.performance.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      },
      update: {
        isCompleted: true,
        lastAccessedAt: new Date(),
        quizScorePercent: score ? Math.max(score, existingPerformance?.quizScorePercent || 0) : undefined
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: true,
        quizScorePercent: score || 0
      }
    })

    // Attribution des badges de maîtrise
    let masteryBadge = null
    let chapterBadge = null
    let courseBadge = null
    let premiumBadge = null

    if (score && score >= 80) {
      // Badge de leçon (Bronze/Argent/Or)
      masteryBadge = await MasteryBadgeService.awardLessonBadge(
        user.id,
        lessonId,
        score
      )

      // Vérifier si un badge de chapitre peut être débloqué
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { 
          subChapter: {
            select: { chapterId: true }
          }
        }
      })

      if (lesson?.subChapter?.chapterId) {
        chapterBadge = await MasteryBadgeService.checkChapterBadge(
          user.id,
          lesson.subChapter.chapterId
        )

        // Vérifier si la leçon est maintenant complète (vidéo + QCM + tous exercices)
        const isComplete = await PremiumBadgeService.isLessonFullyCompleted(user.id, lessonId)
        
        if (isComplete) {
          // Attribuer le badge Premium approprié
          premiumBadge = await PremiumBadgeService.checkAndAwardPremiumBadge(
            user.id,
            lesson.subChapter.chapterId
          )
        }

        // Vérifier si un badge de cours peut être débloqué
        const chapter = await prisma.chapter.findUnique({
          where: { id: lesson.subChapter.chapterId },
          select: { courseId: true }
        })

        if (chapter?.courseId) {
          courseBadge = await MasteryBadgeService.checkCourseBadge(
            user.id,
            chapter.courseId
          )
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      performance,
      badges: {
        lesson: masteryBadge,
        chapter: chapterBadge,
        course: courseBadge,
        premium: premiumBadge
      }
    })
  } catch (error) {
    console.error('Erreur lors du marquage comme complété:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


