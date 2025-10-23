import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const subChapters = await prisma.subChapter.findMany({
      orderBy: [
        { chapterId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        chapter: {
          include: {
            course: {
              select: { title: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ subChapters })
  } catch (error) {
    console.error('[SUBCHAPTERS GET ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


