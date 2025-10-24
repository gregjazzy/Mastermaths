import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'
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
    const { score } = body

    // Mettre à jour ou créer la performance avec le score du QCM
    const performance = await prisma.performance.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        }
      },
      update: {
        quizScorePercent: score,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        quizScorePercent: score,
      }
    })

    return NextResponse.json({ success: true, performance })
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du score:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


