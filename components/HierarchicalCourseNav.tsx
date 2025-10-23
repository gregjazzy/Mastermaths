'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Lock, CheckCircle2, Circle, Play } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: string
  order: number
  level: number
  parentLessonId: string | null
  prerequisiteLessonId: string | null
  isCompleted: boolean
  progress: number
  quizScore: number | null
  childLessons: Lesson[]
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

interface CourseData {
  id: string
  title: string
  chapters: Chapter[]
}

interface HierarchicalCourseNavProps {
  course: CourseData
  currentLessonId?: string
}

export default function HierarchicalCourseNav({ course, currentLessonId }: HierarchicalCourseNavProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedSubChapters, setExpandedSubChapters] = useState<Set<string>>(new Set())
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set())

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

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId)
    } else {
      newExpanded.add(lessonId)
    }
    setExpandedLessons(newExpanded)
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.isCompleted) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    }
    if (lesson.prerequisiteLessonId) {
      return <Lock className="w-4 h-4 text-gray-400" />
    }
    if (lesson.progress > 0) {
      return <Play className="w-4 h-4 text-blue-500" />
    }
    return <Circle className="w-4 h-4 text-gray-300" />
  }

  const renderLesson = (lesson: Lesson, courseId: string) => {
    const hasChildren = lesson.childLessons && lesson.childLessons.length > 0
    const isExpanded = expandedLessons.has(lesson.id)
    const isActive = lesson.id === currentLessonId
    
    // Indentation selon le niveau (1, 2, ou 3)
    const indentClass = lesson.level === 1 ? 'ml-0' : lesson.level === 2 ? 'ml-6' : 'ml-12'
    
    return (
      <div key={lesson.id} className={`${indentClass}`}>
        <div className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${
          isActive ? 'bg-master-turquoise/10 border-l-4 border-master-turquoise' : ''
        }`}>
          {/* Bouton expand/collapse si a des enfants */}
          {hasChildren && (
            <button
              onClick={() => toggleLesson(lesson.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* Icône de statut */}
          <div className="flex-shrink-0">
            {getLessonIcon(lesson)}
          </div>
          
          {/* Lien vers la leçon */}
          <Link
            href={`/cours/${courseId}/lecon/${lesson.id}`}
            className="flex-1 text-sm hover:text-master-turquoise transition-colors"
          >
            <span className={`${isActive ? 'font-semibold text-master-turquoise' : 'text-gray-700'}`}>
              {lesson.title}
            </span>
            {lesson.progress > 0 && lesson.progress < 100 && (
              <span className="ml-2 text-xs text-gray-500">
                ({Math.round(lesson.progress)}%)
              </span>
            )}
          </Link>
          
          {/* Badge du type pour les niveaux 2 et 3 */}
          {lesson.level > 1 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {getLessonTypeEmoji(lesson.type)}
            </span>
          )}
        </div>
        
        {/* Enfants (sous-leçons) */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {lesson.childLessons.map(child => renderLesson(child, courseId))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
      <h2 className="text-xl font-bold text-master-dark mb-4">{course.title}</h2>
      
      <div className="space-y-2">
        {course.chapters.map(chapter => {
          const isChapterExpanded = expandedChapters.has(chapter.id)
          
          return (
            <div key={chapter.id}>
              {/* Chapitre */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isChapterExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <span className="font-semibold text-gray-800">{chapter.title}</span>
              </button>
              
              {/* Sous-chapitres */}
              {isChapterExpanded && (
                <div className="mt-2 ml-4 space-y-2">
                  {chapter.subChapters.map(subChapter => {
                    const isSubChapterExpanded = expandedSubChapters.has(subChapter.id)
                    
                    return (
                      <div key={subChapter.id}>
                        {/* Sous-chapitre */}
                        <button
                          onClick={() => toggleSubChapter(subChapter.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          {isSubChapterExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <span className="font-medium text-gray-700">{subChapter.title}</span>
                        </button>
                        
                        {/* Leçons */}
                        {isSubChapterExpanded && (
                          <div className="mt-1 space-y-1">
                            {subChapter.lessons.map(lesson => renderLesson(lesson, course.id))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

function getLessonTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    VIDEO_COURS: '🎥',
    QCM: '📝',
    CORRECTION_VIDEO: '✅',
    CORRECTION_DOCUMENT: '📄',
    EXO_ECRIT: '📋',
    DS: '📝',
    CARTOGRAPHIE: '🗺️',
    METHODE: '💡',
  }
  return emojis[type] || '📄'
}


