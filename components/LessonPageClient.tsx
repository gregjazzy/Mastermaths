'use client'

import { useState } from 'react'
import VerticalTimelineCourseNav from './VerticalTimelineCourseNav'
import LessonViewer from './LessonViewer'
import KnowledgeGraphButton from './KnowledgeGraphButton'
import MindMapButton from './MindMapButton'
import { Menu, X } from 'lucide-react'

interface Exercise {
  id: string
  title: string
  order: number
}

interface Lesson {
  id: string
  title: string
  type: string
  order: number
  isCompleted: boolean
  progress: number
  quizScore: number | null
  exercises?: Exercise[]
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
  mentalMapUrl?: string | null
  subChapters: SubChapter[]
}

interface CourseData {
  id: string
  title: string
  chapters: Chapter[]
}

interface LessonPageClientProps {
  courseData: CourseData
  lessonId: string
  breadcrumb: string
  lessonTitle: string
}

export default function LessonPageClient({
  courseData,
  lessonId,
  breadcrumb,
  lessonTitle,
}: LessonPageClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Trouver le chapitre actuel pour le Mind Map
  let currentChapter: Chapter | null = null
  for (const chapter of courseData.chapters) {
    for (const subChapter of chapter.subChapters) {
      if (subChapter.lessons.some(l => l.id === lessonId)) {
        currentChapter = chapter
        break
      }
    }
    if (currentChapter) break
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton flottant pour ouvrir la navigation mobile */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-master-turquoise text-white rounded-full shadow-2xl hover:bg-master-turquoise-dark transition-all hover:scale-110 active:scale-95"
        aria-label="Ouvrir la navigation"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Navigation mobile slide-in */}
      {mobileNavOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Panel de navigation */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white z-50 lg:hidden overflow-y-auto shadow-2xl">
            {/* Header avec bouton fermer */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-lg text-master-dark">Navigation</h2>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Timeline */}
            <VerticalTimelineCourseNav
              course={courseData}
              currentLessonId={lessonId}
            />
          </div>
        </>
      )}

      {/* Layout avec sidebar timeline */}
      <div className="flex">
        {/* Sidebar Timeline - Desktop uniquement */}
        <div className="hidden lg:block w-96 h-screen sticky top-0 border-r-2 border-gray-200 shadow-lg">
          <VerticalTimelineCourseNav
            course={courseData}
            currentLessonId={lessonId}
          />
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-600">
              {breadcrumb}
            </div>

            {/* Boutons Knowledge Graph et Mind Map - Visibles sur mobile */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-4">
              <KnowledgeGraphButton courseId={courseData.id} />
              {currentChapter?.mentalMapUrl && (
                <MindMapButton 
                  chapterId={currentChapter.id}
                  chapterTitle={currentChapter.title}
                  hasMap={true}
                />
              )}
            </div>

            {/* Titre */}
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-master-dark">
              {lessonTitle}
            </h1>

            {/* Viewer de leçon */}
            <LessonViewer lessonId={lessonId} />
          </div>
        </div>
      </div>
    </div>
  )
}

