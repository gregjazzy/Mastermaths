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

    // Récupérer les questions du QCM
    const questions = await prisma.qcmQuestion.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        order: true,
      }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


