import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Récupérer le cours avec toute la hiérarchie et les performances
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      select: {
        id: true,
        title: true,
        chapters: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            subChapters: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    performances: {
                      where: { userId: user.id },
                      select: {
                        isCompleted: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 })
    }

    // Formater les données avec les états de complétion
    const formattedCourse = {
      id: course.id,
      title: course.title,
      chapters: course.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        subChapters: chapter.subChapters.map(subChapter => ({
          id: subChapter.id,
          title: subChapter.title,
          lessons: subChapter.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            isCompleted: lesson.performances?.[0]?.isCompleted || false
          }))
        }))
      }))
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error('Erreur récupération Knowledge Graph:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

