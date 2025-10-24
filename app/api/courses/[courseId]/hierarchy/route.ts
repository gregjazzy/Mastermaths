import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/access-control'
export const dynamic = 'force-dynamic'


export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const courseId = params.courseId

    // Récupérer le cours avec toute la hiérarchie
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            subChapters: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  include: {
                    exercises: {
                      orderBy: { order: 'asc' }
                    },
                    performances: {
                      where: { userId: user.id },
                      select: {
                        videoProgressPercent: true,
                        quizScorePercent: true,
                        isCompleted: true,
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
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Formater les données pour inclure la progression ET la hiérarchie
    const formatLesson = (lesson: any, level: number = 1) => {
      const performance = lesson.performances?.[0]
      return {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        order: lesson.order,
        level, // Niveau d'indentation (1, 2, ou 3)
        parentLessonId: lesson.parentLessonId,
        prerequisiteLessonId: lesson.prerequisiteLessonId,
        isCompleted: performance?.isCompleted || false,
        progress: performance?.videoProgressPercent || 0,
        quizScore: performance?.quizScorePercent,
        childLessons: lesson.childLessons?.map((child: any) => formatLesson(child, level + 1)) || []
      }
    }

    const formattedCourse = {
      id: course.id,
      title: course.title,
      chapters: course.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.order,
        subChapters: chapter.subChapters.map(subChapter => ({
          id: subChapter.id,
          title: subChapter.title,
          order: subChapter.order,
          lessons: subChapter.lessons.map(lesson => formatLesson(lesson, 1))
        }))
      }))
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error('Erreur lors de la récupération de la hiérarchie:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

