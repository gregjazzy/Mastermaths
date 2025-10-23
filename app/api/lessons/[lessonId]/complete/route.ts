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
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: true,
      }
    })

    return NextResponse.json({ success: true, performance })
  } catch (error) {
    console.error('Erreur lors du marquage comme complété:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


