import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import HierarchicalCourseNav from '@/components/HierarchicalCourseNav'
import LessonViewer from '@/components/LessonViewer'

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  // Récupérer l'utilisateur et la leçon avec toute sa hiérarchie
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, status: true }
  })

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    select: { 
      id: true,
      title: true,
      type: true,
      contentUrl: true,
      isDemoContent: true,
      subChapter: {
        select: {
          id: true,
          title: true,
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

  if (!user || !lesson) {
    console.log('❌ User ou lesson introuvable, redirect /cours')
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

  console.log('✅ Access granted!')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-600">
          {lesson.subChapter.chapter.course.title} → {lesson.subChapter.chapter.title} → {lesson.subChapter.title}
        </div>
        <h1 className="text-3xl font-bold mb-6 text-master-dark">{lesson.title}</h1>
        <LessonViewer lessonId={params.lessonId} />
      </div>
    </div>
  )
}

