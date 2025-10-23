import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'

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

    // Vérifier que c'est bien un QCM
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { 
        type: true,
        correctionVideos: {
          where: { isCorrectionVideo: true },
          select: {
            id: true,
            contentUrl: true
          }
        }
      }
    })

    if (!lesson || lesson.type !== 'QCM') {
      return NextResponse.json(
        { shouldShowCorrection: false },
        { status: 200 }
      )
    }

    // Récupérer la performance de l'utilisateur pour ce QCM
    const performance = await prisma.performance.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      },
      select: {
        quizScorePercent: true
      }
    })

    // Si le score est inférieur à 100% ET qu'une vidéo de correction existe
    const shouldShowCorrection = 
      performance && 
      performance.quizScorePercent !== null && 
      performance.quizScorePercent < 100 &&
      lesson.correctionVideos.length > 0

    return NextResponse.json({
      shouldShowCorrection,
      correctionVideoUrl: shouldShowCorrection ? lesson.correctionVideos[0].contentUrl : null,
      correctionVideoId: shouldShowCorrection ? lesson.correctionVideos[0].id : null,
    })
  } catch (error) {
    console.error('Erreur lors de la vérification de la correction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


