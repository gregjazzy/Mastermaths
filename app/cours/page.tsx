import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import CourseCard from '@/components/CourseCard'
import Link from 'next/link'
import { BookOpen, Lock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

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
        select: {
          id: true,
          title: true,
          isDemoContent: true,
          subChapters: {
            select: {
              id: true,
              title: true,
              isDemoContent: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  isDemoContent: true
                }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  })

  // Récupérer les performances pour calculer la progression
  const performances = await prisma.performance.findMany({
    where: { 
      userId: user.id,
      lessonId: { not: null }
    },
    select: {
      lessonId: true,
      isCompleted: true
    }
  })

  // Récupérer tous les cours pour afficher les verrouillés
  const allCourses = user.status !== 'PREMIUM' 
    ? await prisma.course.findMany({
        where: { isDemoContent: false },
        orderBy: { order: 'asc' }
      })
    : []

  // Palette de couleurs douces
  const courseColors = [
    'from-cyan-400 to-teal-500',      // Turquoise (signature)
    'from-blue-400 to-blue-500',      // Bleu doux
    'from-indigo-400 to-indigo-500',  // Indigo
    'from-purple-400 to-purple-500',  // Violet pastel
    'from-pink-400 to-rose-500',      // Rose doux
  ]

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
          {courses.map((course, index) => {
            const totalLessons = course.chapters.reduce(
              (sum, ch) => sum + ch.subChapters.reduce(
                (subSum, sc) => subSum + sc.lessons.length, 0
              ), 0
            )

            console.log(`🔍 Processing course: ${course.title}`, {
              userStatus: user.status,
              nbChapters: course.chapters.length
            })

            // Trouver la première leçon accessible (entièrement DEMO si nécessaire)
            let firstAccessibleLesson = null
            for (const chapter of course.chapters) {
              console.log(`  📖 Chapter: ${chapter.title}, isDemoContent: ${chapter.isDemoContent}`)
              
              // Si l'utilisateur est DEMO, vérifier que le chapitre est DEMO
              if (user.status === 'DEMO' && !chapter.isDemoContent) {
                console.log(`    ❌ Skipping chapter (not DEMO)`)
                continue
              }
              
              for (const subChapter of chapter.subChapters) {
                console.log(`    📑 SubChapter: ${subChapter.title}, isDemoContent: ${subChapter.isDemoContent}`)
                
                // Si l'utilisateur est DEMO, vérifier que le sous-chapitre est DEMO
                if (user.status === 'DEMO' && !subChapter.isDemoContent) {
                  console.log(`      ❌ Skipping subchapter (not DEMO)`)
                  continue
                }
                
                for (const lesson of subChapter.lessons) {
                  console.log(`      📝 Lesson: ${lesson.title}, isDemoContent: ${lesson.isDemoContent}`)
                  
                  // Si l'utilisateur est DEMO, vérifier que la leçon est DEMO
                  if (user.status === 'DEMO' && !lesson.isDemoContent) {
                    console.log(`        ❌ Skipping lesson (not DEMO)`)
                    continue
                  }
                  
                  firstAccessibleLesson = lesson.id
                  console.log(`        ✅ Found first accessible lesson: ${lesson.id}`)
                  break
                }
                if (firstAccessibleLesson) break
              }
              if (firstAccessibleLesson) break
            }

            // Si aucune leçon accessible, ne pas afficher le cours
            if (!firstAccessibleLesson) {
              console.log(`❌ No accessible lesson found for course ${course.title}`)
              return null
            }

            console.log(`✅ Will redirect to: /cours/${course.id}/lecon/${firstAccessibleLesson}`)

            // Calculer la progression pour ce cours
            const courseLessonIds = course.chapters.flatMap(ch => 
              ch.subChapters.flatMap(sc => 
                sc.lessons.map(l => l.id)
              )
            )

            const completedLessonsCount = performances.filter(p => 
              courseLessonIds.includes(p.lessonId!) && p.isCompleted
            ).length

            const progressPercentage = totalLessons > 0 
              ? Math.round((completedLessonsCount / totalLessons) * 100)
              : 0

            const isInProgress = completedLessonsCount > 0 && completedLessonsCount < totalLessons
            const isCompleted = completedLessonsCount === totalLessons && totalLessons > 0

            // Attribuer une couleur basée sur l'index du cours
            const colorGradient = courseColors[index % courseColors.length]

            return (
              <CourseCard
                key={course.id}
                course={course}
                firstLessonId={firstAccessibleLesson}
                progressPercentage={progressPercentage}
                completedLessons={completedLessonsCount}
                totalLessons={totalLessons}
                colorGradient={colorGradient}
                isInProgress={isInProgress}
                isCompleted={isCompleted}
              />
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
                    <div className="text-gray-500 text-sm mb-4 prose prose-sm max-w-none">
                      {course.description && (
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{course.description}</ReactMarkdown>
                      )}
                    </div>
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


