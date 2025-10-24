import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const { 
      lessonId, 
      title, 
      order, 
      exerciseUrl, 
      correctionVideoUrl, 
      correctionDocumentUrl
    } = body

    const exercise = await prisma.exercise.update({
      where: { id: params.id },
      data: {
        lessonId,
        title,
        order,
        exerciseUrl: exerciseUrl || null,
        correctionVideoUrl: correctionVideoUrl || null,
        correctionDocumentUrl: correctionDocumentUrl || null
      }
    })

    return NextResponse.json({ exercise, success: true })
  } catch (error) {
    console.error('[EXERCISE PUT ERROR]', error)
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

    await prisma.exercise.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[EXERCISE DELETE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

