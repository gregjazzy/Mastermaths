'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, BookOpen, FileText, Video, CheckCircle2 } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: string
  order: number
  isCompleted?: boolean
  progress?: number
}

interface SubChapter {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

interface Chapter {
  id: string
  title: string
  order: number
  subChapters: SubChapter[]
}

interface Course {
  id: string
  title: string
  chapters: Chapter[]
}

interface CourseHierarchyNavProps {
  courseId: string
  currentLessonId?: string
}

export default function CourseHierarchyNav({ courseId, currentLessonId }: CourseHierarchyNavProps) {
  const pathname = usePathname()
  const [course, setCourse] = useState<Course | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedSubChapters, setExpandedSubChapters] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCourseHierarchy()
  }, [courseId])

  const fetchCourseHierarchy = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/hierarchy`)
      const data = await response.json()
      setCourse(data)
      
      // Auto-expand le chapitre et sous-chapitre de la leçon actuelle
      if (currentLessonId) {
        const { chapterId, subChapterId } = findLessonParents(data, currentLessonId)
        if (chapterId) setExpandedChapters(new Set([chapterId]))
        if (subChapterId) setExpandedSubChapters(new Set([subChapterId]))
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la hiérarchie:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const findLessonParents = (course: Course, lessonId: string) => {
    for (const chapter of course.chapters) {
      for (const subChapter of chapter.subChapters) {
        if (subChapter.lessons.some(l => l.id === lessonId)) {
          return { chapterId: chapter.id, subChapterId: subChapter.id }
        }
      }
    }
    return { chapterId: null, subChapterId: null }
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const toggleSubChapter = (subChapterId: string) => {
    const newExpanded = new Set(expandedSubChapters)
    if (newExpanded.has(subChapterId)) {
      newExpanded.delete(subChapterId)
    } else {
      newExpanded.add(subChapterId)
    }
    setExpandedSubChapters(newExpanded)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_COURS':
        return <Video className="w-4 h-4" />
      case 'CORRECTION_VIDEO':
        return <Video className="w-4 h-4 text-orange-500" />
      case 'QCM':
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="h-full bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="h-full bg-white border-r border-gray-200 p-4">
        <p className="text-gray-500">Aucun cours trouvé</p>
      </div>
    )
  }

  return (
    <nav className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-master-dark">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {course.title}
        </h2>
      </div>

      <div className="p-2">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="mb-2">
            {/* Chapitre */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expandedChapters.has(chapter.id) ? (
                <ChevronDown className="w-4 h-4 text-master-turquoise" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-semibold text-master-dark text-sm">
                {chapter.title}
              </span>
            </button>

            {/* Sous-chapitres */}
            {expandedChapters.has(chapter.id) && (
              <div className="ml-4 mt-1">
                {chapter.subChapters.map((subChapter) => (
                  <div key={subChapter.id} className="mb-1">
                    <button
                      onClick={() => toggleSubChapter(subChapter.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedSubChapters.has(subChapter.id) ? (
                        <ChevronDown className="w-3 h-3 text-master-turquoise" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                      <span className="font-medium text-gray-700 text-sm">
                        {subChapter.title}
                      </span>
                    </button>

                    {/* Leçons */}
                    {expandedSubChapters.has(subChapter.id) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {subChapter.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/cours/${courseId}/lecon/${lesson.id}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              currentLessonId === lesson.id
                                ? 'bg-master-turquoise/10 text-master-turquoise font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {getLessonIcon(lesson.type)}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            {lesson.isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                            {lesson.progress && lesson.progress > 0 && lesson.progress < 100 && (
                              <div className="w-12 h-1 bg-gray-200 rounded-full flex-shrink-0">
                                <div
                                  className="h-full bg-master-turquoise rounded-full"
                                  style={{ width: `${lesson.progress}%` }}
                                />
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}


