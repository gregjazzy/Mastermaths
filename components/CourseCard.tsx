'use client'

import Link from 'next/link'
import { BookOpen, Clock, BarChart3, CheckCircle2, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string | null
    chapters: {
      id: string
      title: string
      subChapters: {
        lessons: {
          id: string
        }[]
      }[]
    }[]
    isDemoContent: boolean
  }
  firstLessonId: string
  progressPercentage?: number
  completedLessons?: number
  totalLessons: number
  estimatedHours?: number
  colorGradient: string
  isInProgress?: boolean
  isCompleted?: boolean
}

export default function CourseCard({
  course,
  firstLessonId,
  progressPercentage = 0,
  completedLessons = 0,
  totalLessons,
  estimatedHours = 0,
  colorGradient,
  isInProgress = false,
  isCompleted = false
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculer les heures estimées si pas fourni (environ 30min par leçon)
  const hours = estimatedHours || Math.ceil(totalLessons * 0.5)

  return (
    <Link
      href={`/cours/${course.id}/lecon/${firstLessonId}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
        {/* Header coloré */}
        <div className={`bg-gradient-to-br ${colorGradient} p-6 relative overflow-hidden`}>
          {/* Pattern de fond subtil */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-white" />
                {course.isDemoContent && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                    DÉMO
                  </span>
                )}
                {isInProgress && !isCompleted && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" />
                    En cours
                  </span>
                )}
                {isCompleted && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terminé
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">
                {course.title}
              </h3>
            </div>

            {/* Badge de progression circulaire */}
            {progressPercentage > 0 && (
              <div className="relative w-16 h-16 ml-4">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 prose prose-sm max-w-none [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1 [&>strong]:font-bold [&>em]:italic">
            {course.description ? (
              <ReactMarkdown>
                {course.description}
              </ReactMarkdown>
            ) : (
              <p>Découvrez ce cours complet et progressez à votre rythme.</p>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Chapitres</span>
              <span className="text-sm font-bold text-gray-700">{course.chapters.length}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Leçons</span>
              <span className="text-sm font-bold text-gray-700">
                {progressPercentage > 0 ? `${completedLessons}/${totalLessons}` : totalLessons}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Durée</span>
              <span className="text-sm font-bold text-gray-700">{hours}h</span>
            </div>
          </div>

          {/* Barre de progression */}
          {progressPercentage > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progression</span>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${colorGradient} transition-all duration-500 rounded-full`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Preview des chapitres (au hover sur desktop, toujours visible sur mobile) */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isHovered ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 md:max-h-0 md:opacity-0'
          } md:group-hover:max-h-48 md:group-hover:opacity-100`}>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Contenu du cours</p>
              <ul className="space-y-1">
                {course.chapters.slice(0, 3).map((chapter, idx) => (
                  <li key={chapter.id} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span className="line-clamp-1">{chapter.title}</span>
                  </li>
                ))}
                {course.chapters.length > 3 && (
                  <li className="text-xs text-gray-400 italic">
                    +{course.chapters.length - 3} autres chapitres...
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4">
            <div className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent group-hover:gap-3`}>
              {progressPercentage > 0 ? 'Continuer le cours' : 'Commencer le cours'}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

