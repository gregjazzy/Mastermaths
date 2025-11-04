import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const chapters = await prisma.chapter.findMany({
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        course: {
          select: { title: true }
        },
        _count: {
          select: { subChapters: true }
        }
      }
    })

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('[CHAPTERS GET ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, title, description, order, mentalMapUrl, lyceesRepertoireUrl } = body

    const chapter = await prisma.chapter.create({
      data: {
        courseId,
        title,
        description: description || null,
        order: order || 1,
        mentalMapUrl: mentalMapUrl || null,
        lyceesRepertoireUrl: lyceesRepertoireUrl || null
      }
    })

    return NextResponse.json({ chapter, success: true })
  } catch (error) {
    console.error('[CHAPTERS POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


