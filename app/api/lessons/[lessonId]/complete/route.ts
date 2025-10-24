import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'
import { MasteryBadgeService } from '@/lib/mastery-badge-service'

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
        bestScore: score ? Math.max(score, performance?.bestScore || 0) : undefined
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: true,
        bestScore: score || 0
      }
    })

    // Attribution des badges de maîtrise
    let masteryBadge = null
    let chapterBadge = null
    let courseBadge = null

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
        course: courseBadge
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


