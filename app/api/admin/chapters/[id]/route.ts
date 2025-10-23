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
    const { courseId, title, order, mentalMapUrl, lyceesRepertoireUrl } = body

    const chapter = await prisma.chapter.update({
      where: { id: params.id },
      data: {
        courseId,
        title,
        order,
        mentalMapUrl: mentalMapUrl || null,
        lyceesRepertoireUrl: lyceesRepertoireUrl || null
      }
    })

    return NextResponse.json({ chapter, success: true })
  } catch (error) {
    console.error('[CHAPTER PUT ERROR]', error)
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

    await prisma.chapter.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CHAPTER DELETE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


