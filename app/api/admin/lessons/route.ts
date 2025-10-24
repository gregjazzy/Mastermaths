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

    const lessons = await prisma.lesson.findMany({
      orderBy: [
        { subChapterId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        subChapter: {
          include: {
            chapter: {
              include: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('[LESSONS GET ERROR]', error)
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
    const { 
      subChapterId, 
      title, 
      type, 
      order, 
      vimeoVideoId,
      contentUrl,
      countForReporting, 
      isOptional 
    } = body

    const lesson = await prisma.lesson.create({
      data: {
        subChapterId,
        title,
        type,
        order: order || 1,
        contentUrl: vimeoVideoId || contentUrl || null,
        countForReporting: countForReporting !== undefined ? countForReporting : true,
        isOptional: isOptional || false
      }
    })

    return NextResponse.json({ lesson, success: true })
  } catch (error) {
    console.error('[LESSONS POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

