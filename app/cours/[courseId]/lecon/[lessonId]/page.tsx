import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import LessonPageClient from '@/components/LessonPageClient'

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, status: true }
  })

  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer la leçon avec toute sa hiérarchie pour vérification d'accès
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    select: { 
      id: true,
      title: true,
      type: true,
      contentUrl: true,
      appTitle: true,
      appDescription: true,
      isDemoContent: true,
      subChapter: {
        select: {
          id: true,
          title: true,
          appUrl: true,
          appTitle: true,
          appDescription: true,
          isDemoContent: true,
          chapter: {
            select: {
              id: true,
              title: true,
              isDemoContent: true,
              course: {
                select: { 
                  id: true,
                  title: true,
                  isDemoContent: true 
                }
              }
            }
          }
        }
      }
    }
  })

  if (!lesson) {
    console.log('❌ Lesson introuvable, redirect /cours')
    redirect('/cours')
  }

  // Vérifier l'accès : DEMO ne peut accéder qu'au contenu démo
  const isContentDemo = 
    lesson.isDemoContent &&
    lesson.subChapter.isDemoContent &&
    lesson.subChapter.chapter.isDemoContent &&
    lesson.subChapter.chapter.course.isDemoContent

  if (user.status === 'DEMO' && !isContentDemo) {
    console.log('❌ DEMO user trying to access non-DEMO content, redirect /upgrade')
    redirect('/upgrade')
  }

  if (user.status === 'FREE') {
    console.log('❌ FREE user trying to access course, redirect /upgrade')
    redirect('/upgrade')
  }

  // Récupérer la hiérarchie complète du cours pour la timeline
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
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
                    orderBy: { order: 'asc' },
                    select: {
                      id: true,
                      title: true,
                      order: true,
                    }
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
    redirect('/cours')
  }

  console.log('✅ Access granted!')

  // Formater les données pour la timeline
  const courseData = {
    id: course.id,
    title: course.title,
    chapters: course.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.order,
      mentalMapUrl: chapter.mentalMapUrl,
      subChapters: chapter.subChapters.map(subChapter => ({
        id: subChapter.id,
        title: subChapter.title,
        order: subChapter.order,
        lessons: subChapter.lessons.map(lesson => {
          const performance = lesson.performances?.[0]
          return {
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            order: lesson.order,
            isCompleted: performance?.isCompleted || false,
            progress: performance?.videoProgressPercent || 0,
            quizScore: performance?.quizScorePercent,
            exercises: lesson.exercises,
          }
        })
      }))
    }))
  }

  return (
    <>
      <Navbar />
      <LessonPageClient
        courseData={courseData}
        lessonId={params.lessonId}
        breadcrumb={`${lesson.subChapter.chapter.course.title} → ${lesson.subChapter.chapter.title} → ${lesson.subChapter.title}`}
        lessonTitle={lesson.title}
        subChapterAppUrl={lesson.subChapter.appUrl}
        subChapterAppTitle={lesson.subChapter.appTitle}
        subChapterAppDescription={lesson.subChapter.appDescription}
        lessonAppUrl={lesson.contentUrl}
        lessonAppTitle={lesson.appTitle}
        lessonAppDescription={lesson.appDescription}
      />
    </>
  )
}

