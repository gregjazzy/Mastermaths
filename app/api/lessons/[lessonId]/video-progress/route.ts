import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'

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
    const { progress, isCorrectionVideo } = body

    // Mettre à jour la progression vidéo
    const performance = await prisma.performance.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      },
      update: {
        videoProgressPercent: progress,
        hasViewedCorrection: isCorrectionVideo ? true : undefined,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        videoProgressPercent: progress,
        hasViewedCorrection: isCorrectionVideo,
      }
    })

    return NextResponse.json({ success: true, performance })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la progression vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


