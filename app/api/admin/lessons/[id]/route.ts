import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { subChapterId, title, type, order, vimeoVideoId, documentUrl, linkedExerciseId, prerequisiteLessonId, parentLessonId, countForReporting, isOptional } = body

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        subChapterId,
        title,
        type,
        order,
        contentUrl: vimeoVideoId || documentUrl || null,
        linkedExerciseId: linkedExerciseId || null,
        prerequisiteLessonId: prerequisiteLessonId || null,
        parentLessonId: parentLessonId || null,
        countForReporting: countForReporting !== undefined ? countForReporting : true,
        isOptional: isOptional || false,
        isCorrectionVideo: type === 'CORRECTION_VIDEO',
        isCorrectionDocument: type === 'CORRECTION_DOCUMENT'
      }
    })

    return NextResponse.json({ lesson, success: true })
  } catch (error) {
    console.error('[LESSON PUT ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    await prisma.lesson.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LESSON DELETE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

