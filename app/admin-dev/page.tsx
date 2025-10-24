'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Video, FileText, CheckSquare } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: string
  order: number
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
  description: string | null
  order: number
  chapters: Chapter[]
}

export default function AdminHierarchyPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedSubChapters, setExpandedSubChapters] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchHierarchy()
  }, [])

  const fetchHierarchy = async () => {
    try {
      // Pour l'instant, on charge juste les cours
      // TODO: Créer une API qui retourne toute la hiérarchie
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses.map((c: any) => ({ ...c, chapters: [] })))
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
      } else {
        next.add(courseId)
      }
      return next
    })
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const toggleSubChapter = (subChapterId: string) => {
    setExpandedSubChapters(prev => {
      const next = new Set(prev)
      if (next.has(subChapterId)) {
        next.delete(subChapterId)
      } else {
        next.add(subChapterId)
      }
      return next
    })
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-master-dark">
                🗂️ Vue Hiérarchique Complète
              </h1>
              <p className="text-gray-600 mt-1">Gérez tout votre contenu depuis une seule page</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouveau cours
            </button>
          </div>

          {/* Hiérarchie */}
          <div className="space-y-3">
            {courses.map((course) => {
              const isExpanded = expandedCourses.has(course.id)
              
              return (
                <div key={course.id} className="card border-2 border-blue-200">
                  {/* COURS */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-blue-600">
                        📚 {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-gray-600">{course.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="btn-outline text-sm py-1 px-3 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Chapitre
                      </button>
                      <button className="p-2 hover:bg-blue-100 rounded">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* CHAPITRES */}
                  {isExpanded && (
                    <div className="ml-8 mt-4 space-y-2">
                      {course.chapters.length === 0 ? (
                        <div className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded border border-dashed">
                          Aucun chapitre. Cliquez sur "+ Chapitre" pour en créer un.
                        </div>
                      ) : (
                        course.chapters.map((chapter) => {
                          const isChapterExpanded = expandedChapters.has(chapter.id)
                          
                          return (
                            <div key={chapter.id} className="card bg-green-50 border border-green-200">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleChapter(chapter.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  {isChapterExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                
                                <div className="flex-1">
                                  <h4 className="font-bold text-green-700">
                                    📖 {chapter.title}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button className="btn-outline text-sm py-1 px-2 flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Leçon
                                  </button>
                                  <button className="p-1 hover:bg-green-100 rounded">
                                    <Edit className="w-3 h-3 text-green-600" />
                                  </button>
                                  <button className="p-1 hover:bg-red-100 rounded">
                                    <Trash2 className="w-3 h-3 text-red-600" />
                                  </button>
                                </div>
                              </div>

                              {/* SOUS-CHAPITRES ET LEÇONS */}
                              {isChapterExpanded && (
                                <div className="ml-6 mt-3 space-y-2">
                                  {chapter.subChapters.length === 0 ? (
                                    <div className="text-gray-500 text-sm py-3 text-center bg-white rounded border border-dashed">
                                      Aucune leçon. Cliquez sur "+ Leçon" pour en créer une.
                                    </div>
                                  ) : (
                                    chapter.subChapters.map((subChapter) => (
                                      <div key={subChapter.id} className="card bg-purple-50 border border-purple-200 p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <h5 className="font-semibold text-purple-700 text-sm">
                                            📂 {subChapter.title}
                                          </h5>
                                        </div>
                                        
                                        <div className="ml-4 space-y-1">
                                          {subChapter.lessons.map((lesson) => (
                                            <div key={lesson.id} className="flex items-center gap-2 text-sm py-1">
                                              {lesson.type === 'VIDEO' && <Video className="w-4 h-4 text-purple-500" />}
                                              {lesson.type === 'DOCUMENT' && <FileText className="w-4 h-4 text-purple-500" />}
                                              {lesson.type === 'QCM' && <CheckSquare className="w-4 h-4 text-purple-500" />}
                                              <span>{lesson.title}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {courses.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucun cours créé</p>
              <button className="btn-primary">
                Créer le premier cours
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
