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

    const exercises = await prisma.exercise.findMany({
      orderBy: [
        { lessonId: 'asc' },
        { order: 'asc' }
      ],
      include: {
        lesson: {
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
        }
      }
    })

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('[EXERCISES GET ERROR]', error)
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
      lessonId, 
      title, 
      order, 
      exerciseUrl, 
      correctionVideoUrl, 
      correctionDocumentUrl
    } = body

    const exercise = await prisma.exercise.create({
      data: {
        lessonId,
        title,
        order: order || 1,
        exerciseUrl: exerciseUrl || null,
        correctionVideoUrl: correctionVideoUrl || null,
        correctionDocumentUrl: correctionDocumentUrl || null
      }
    })

    return NextResponse.json({ exercise, success: true })
  } catch (error) {
    console.error('[EXERCISES POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

