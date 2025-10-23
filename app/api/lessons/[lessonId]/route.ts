import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, checkLessonAccess } from '@/lib/access-control'

export async function GET(
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

    // Vérifier l'accès à la leçon
    const hasAccess = await checkLessonAccess(lessonId, user.id)
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Récupérer la leçon
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        subChapter: {
          include: {
            chapter: {
              select: { title: true }
            }
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Leçon non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Erreur lors de la récupération de la leçon:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


