import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


export async function GET() {
  try {
    // Pas de vérification de session pour l'admin
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

    console.log('[ADMIN SUBCHAPTERS] Récupérés:', subChapters.length)
    return NextResponse.json({ subChapters })
  } catch (error) {
    console.error('[SUBCHAPTERS GET ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { chapterId, title, description, appUrl, appTitle, appDescription, order } = body

    const subChapter = await prisma.subChapter.create({
      data: {
        chapterId,
        title,
        description: description || null,
        appUrl: appUrl || null,
        appTitle: appTitle || null,
        appDescription: appDescription || null,
        order: order || 1
      }
    })

    return NextResponse.json({ subChapter, success: true })
  } catch (error) {
    console.error('[SUBCHAPTERS POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

