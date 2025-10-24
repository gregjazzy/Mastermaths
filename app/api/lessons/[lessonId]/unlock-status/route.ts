import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer la leçon avec son prérequis
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        prerequisiteLesson: true
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Leçon non trouvée' }, { status: 404 })
    }

    // Si pas de prérequis, la leçon est déverrouillée
    if (!lesson.prerequisiteLessonId) {
      return NextResponse.json({ 
        isUnlocked: true,
        prerequisiteRequired: false
      })
    }

    // Vérifier si le prérequis est complété
    const prerequisitePerformance = await prisma.performance.findFirst({
      where: {
        userId: user.id,
        lessonId: lesson.prerequisiteLessonId,
        isCompleted: true
      }
    })

    const isUnlocked = !!prerequisitePerformance

    return NextResponse.json({
      isUnlocked,
      prerequisiteRequired: true,
      prerequisiteLesson: lesson.prerequisiteLesson ? {
        id: lesson.prerequisiteLesson.id,
        title: lesson.prerequisiteLesson.title,
        type: lesson.prerequisiteLesson.type
      } : null
    })
  } catch (error) {
    console.error('[LESSON UNLOCK CHECK ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


