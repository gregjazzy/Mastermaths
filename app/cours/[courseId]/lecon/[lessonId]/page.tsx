import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import HierarchicalCourseNav from '@/components/HierarchicalCourseNav'
import LessonViewer from '@/components/LessonViewer'

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  // Fetch course hierarchy for the navigation
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${params.courseId}/hierarchy`, {
    cache: 'no-store',
  })
  const course = await response.json()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar de navigation */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <HierarchicalCourseNav 
            course={course}
            currentLessonId={params.lessonId}
          />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-8">
          <LessonViewer lessonId={params.lessonId} />
        </div>
      </div>
    </div>
  )
}

