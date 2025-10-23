import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { BookOpen, Lock, CheckCircle2 } from 'lucide-react'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, status: true }
  })

  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer les cours accessibles
  const courses = await prisma.course.findMany({
    where: user.status === 'PREMIUM' 
      ? {} 
      : { isDemoContent: true },
    include: {
      chapters: {
        include: {
          subChapters: {
            include: {
              lessons: true
            }
          }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  // Récupérer tous les cours pour afficher les verrouillés
  const allCourses = user.status !== 'PREMIUM' 
    ? await prisma.course.findMany({
        where: { isDemoContent: false },
        orderBy: { order: 'asc' }
      })
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-master-dark mb-2">Mes cours</h1>
          <p className="text-gray-600">
            {user.status === 'PREMIUM' 
              ? 'Accès illimité à tous les cours'
              : user.status === 'DEMO'
              ? 'Accès au contenu de démonstration'
              : 'Passez à Premium pour accéder à tout le contenu'
            }
          </p>
        </div>

        {/* Cours accessibles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course) => {
            const totalLessons = course.chapters.reduce(
              (sum, ch) => sum + ch.subChapters.reduce(
                (subSum, sc) => subSum + sc.lessons.length, 0
              ), 0
            )

            return (
              <Link
                key={course.id}
                href={`/cours/${course.id}/lecon/${course.chapters[0]?.subChapters[0]?.lessons[0]?.id || ''}`}
                className="card hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-12 h-12 text-master-turquoise group-hover:scale-110 transition-transform" />
                  {course.isDemoContent && (
                    <span className="bg-master-turquoise/10 text-master-turquoise text-xs font-semibold px-3 py-1 rounded-full">
                      DÉMO
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-master-dark mb-2 group-hover:text-master-turquoise transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{course.chapters.length} chapitres</span>
                  <span>•</span>
                  <span>{totalLessons} leçons</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Cours verrouillés */}
        {allCourses.length > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-master-dark mb-2">
                Contenu Premium
              </h2>
              <p className="text-gray-600">
                Déverrouillez ces cours en passant à Premium
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <div
                  key={course.id}
                  className="card relative overflow-hidden opacity-75"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-900/10 flex items-center justify-center">
                    <Lock className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="relative">
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <Link 
                      href="/upgrade"
                      className="inline-flex items-center gap-2 text-master-turquoise hover:text-master-turquoise-dark font-semibold text-sm"
                    >
                      Débloquer ce cours →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


