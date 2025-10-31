'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, CheckCircle, Clock, Play, Award, TrendingUp, Brain } from 'lucide-react'
import MindMapButton from './MindMapButton'
import KnowledgeGraphButton from './KnowledgeGraphButton'

// ==================== INTERFACES ====================

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
  subChapters: SubChapter[]
  mentalMapUrl?: string | null
}

interface CourseData {
  id: string
  title: string
  chapters: Chapter[]
}

interface VerticalTimelineCourseNavProps {
  course: CourseData
  currentLessonId?: string
}

// ==================== TYPES D'ITEMS ====================

type TimelineItem = {
  type: 'chapter' | 'subchapter' | 'lesson'
  id: string
  title: string
  lessonType?: string
  isCompleted: boolean
  progress: number
  quizScore: number | null
  isLocked: boolean
  isCurrent: boolean
  estimatedTime?: string
  courseId: string
  exercises?: Exercise[]
  mentalMapUrl?: string | null
}

// ==================== HELPER FUNCTIONS ====================

function getLessonIcon(type: string, size: string = 'w-4 h-4') {
  const icons: Record<string, string> = {
    VIDEO_COURS: '🎥',
    QCM: '📝',
    METHODE: '💡',
    CARTOGRAPHIE: '🗺️',
    EXO_ECRIT: '📄',
    DS: '📋',
  }
  return <span className={`${size}`}>{icons[type] || '📚'}</span>
}

function getEstimatedTime(type: string): string {
  const times: Record<string, string> = {
    VIDEO_COURS: '~15 min',
    QCM: '~10 min',
    METHODE: '~5 min',
    CARTOGRAPHIE: '~5 min',
    EXO_ECRIT: '~20 min',
    DS: '~45 min',
  }
  return times[type] || '~10 min'
}

function getBadgeFromScore(score: number | null): { emoji: string; color: string; label: string } | null {
  if (score === null) return null
  if (score === 100) return { emoji: '🥇', color: 'text-yellow-500', label: 'Gold' }
  if (score >= 90) return { emoji: '🥈', color: 'text-gray-400', label: 'Silver' }
  if (score >= 80) return { emoji: '🥉', color: 'text-orange-600', label: 'Bronze' }
  return null
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function VerticalTimelineCourseNav({ course, currentLessonId }: VerticalTimelineCourseNavProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])

  useEffect(() => {
    buildTimeline()
  }, [course, currentLessonId])

  // Construire la timeline linéaire à partir de la hiérarchie
  const buildTimeline = () => {
    const items: TimelineItem[] = []
    let previousItemCompleted = true

    course.chapters.forEach((chapter) => {
      // Ajouter le chapitre
      const chapterCompleted = chapter.subChapters.every(sc => 
        sc.lessons.every(l => l.isCompleted)
      )
      
      items.push({
        type: 'chapter',
        id: chapter.id,
        title: chapter.title,
        isCompleted: chapterCompleted,
        progress: 0,
        quizScore: null,
        isLocked: false,
        isCurrent: false,
        courseId: course.id,
        mentalMapUrl: chapter.mentalMapUrl,
      })

      chapter.subChapters.forEach((subChapter) => {
        // Ajouter le sous-chapitre
        const subChapterCompleted = subChapter.lessons.every(l => l.isCompleted)
        
        items.push({
          type: 'subchapter',
          id: subChapter.id,
          title: subChapter.title,
          isCompleted: subChapterCompleted,
          progress: 0,
          quizScore: null,
          isLocked: false,
          isCurrent: false,
          courseId: course.id,
        })

        // Ajouter les leçons
        subChapter.lessons.forEach((lesson) => {
          const isLocked = !previousItemCompleted
          const isCurrent = lesson.id === currentLessonId

          items.push({
            type: 'lesson',
            id: lesson.id,
            title: lesson.title,
            lessonType: lesson.type,
            isCompleted: lesson.isCompleted,
            progress: lesson.progress,
            quizScore: lesson.quizScore,
            isLocked,
            isCurrent,
            estimatedTime: getEstimatedTime(lesson.type),
            courseId: course.id,
            exercises: lesson.exercises,
          })

          // Mettre à jour le statut pour le verrouillage des suivantes
          if (lesson.isCompleted) {
            previousItemCompleted = true
          } else {
            previousItemCompleted = false
          }
        })
      })
    })

    setTimelineItems(items)
  }

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
      <div className="p-6">
        {/* Header du cours */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-master-dark mb-2">{course.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{calculateGlobalProgress(timelineItems)}% complété</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{countCompletedItems(timelineItems)} / {countTotalLessons(timelineItems)} leçons</span>
            </div>
          </div>
          
          {/* Bouton Knowledge Graph */}
          <KnowledgeGraphButton courseId={course.id} />
        </div>

        {/* Timeline */}
        <div className="relative">
          {timelineItems.map((item, index) => {
            const previousItem = index > 0 ? timelineItems[index - 1] : null
            const nextItem = index < timelineItems.length - 1 ? timelineItems[index + 1] : null
            
            // Déterminer si la ligne au-dessus doit être colorée
            const lineAboveColored = previousItem && previousItem.isCompleted && item.isCompleted

            return (
              <div key={`${item.type}-${item.id}`} className="relative">
                {/* Ligne de connexion vers l'élément précédent */}
                {index > 0 && (
                  <div 
                    className={`absolute left-6 -top-6 w-0.5 h-6 transition-all duration-500 ${
                      lineAboveColored 
                        ? 'bg-gradient-to-b from-master-turquoise to-master-turquoise' 
                        : 'bg-gray-300'
                    }`}
                  />
                )}

                {/* Rendu selon le type */}
                {item.type === 'chapter' && (
                  <ChapterNode item={item} />
                )}
                
                {item.type === 'subchapter' && (
                  <SubChapterNode item={item} />
                )}
                
                {item.type === 'lesson' && (
                  <LessonCard 
                    item={item} 
                    courseId={course.id}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==================== COMPOSANTS ENFANTS ====================

function ChapterNode({ item }: { item: TimelineItem }) {
  return (
    <div className="mb-8 mt-8">
      <div className="flex items-center gap-4">
        {/* Cercle du chapitre */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          item.isCompleted
            ? 'bg-gradient-to-br from-master-turquoise to-cyan-600 ring-4 ring-master-turquoise/20'
            : 'bg-gradient-to-br from-master-dark to-gray-700 ring-4 ring-gray-300/20'
        }`}>
          {item.isCompleted ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <span className="text-2xl">📚</span>
          )}
        </div>
        
        {/* Titre du chapitre */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-master-dark">{item.title}</h3>
          {item.isCompleted && (
            <p className="text-sm text-master-turquoise font-medium">✓ Chapitre complété</p>
          )}
        </div>
      </div>

      {/* Bouton Mind Map si disponible */}
      {item.mentalMapUrl && (
        <div className="mt-3 ml-16">
          <MindMapButton 
            chapterId={item.id}
            chapterTitle={item.title}
            hasMap={true}
          />
        </div>
      )}
    </div>
  )
}

function SubChapterNode({ item }: { item: TimelineItem }) {
  return (
    <div className="flex items-center gap-4 mb-6 ml-6">
      {/* Cercle du sous-chapitre */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
        item.isCompleted
          ? 'bg-master-turquoise/20 ring-2 ring-master-turquoise'
          : 'bg-gray-200 ring-2 ring-gray-300'
      }`}>
        {item.isCompleted ? (
          <CheckCircle className="w-5 h-5 text-master-turquoise" />
        ) : (
          <span className="text-lg">📑</span>
        )}
      </div>
      
      {/* Titre du sous-chapitre */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
      </div>
    </div>
  )
}

function LessonCard({ item, courseId }: { item: TimelineItem; courseId: string }) {
  const badge = getBadgeFromScore(item.quizScore)
  
  return (
    <div className="flex items-start gap-4 mb-6 ml-12">
      {/* Cercle de la leçon */}
      <div className="relative flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          item.isLocked
            ? 'bg-gray-200 ring-2 ring-gray-300'
            : item.isCurrent
            ? 'bg-master-turquoise ring-4 ring-master-turquoise/30 animate-pulse'
            : item.isCompleted
            ? 'bg-master-turquoise ring-2 ring-master-turquoise/50'
            : 'bg-white ring-2 ring-gray-400'
        }`}>
          {item.isLocked ? (
            <Lock className="w-4 h-4 text-gray-500" />
          ) : item.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : item.isCurrent ? (
            <Play className="w-4 h-4 text-white" />
          ) : (
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          )}
        </div>

        {/* Badge si score */}
        {badge && (
          <div className="absolute -top-1 -right-1 text-lg">{badge.emoji}</div>
        )}
      </div>

      {/* Carte de la leçon */}
      {item.isLocked ? (
        <div className="flex-1 bg-gray-50 rounded-lg p-4 border-2 border-gray-200 opacity-60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getLessonIcon(item.lessonType || '')}
              <h5 className="font-medium text-gray-500">{item.title}</h5>
            </div>
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-2">🔒 Terminez la leçon précédente</p>
        </div>
      ) : (
        <Link 
          href={`/cours/${courseId}/lecon/${item.id}`}
          className={`flex-1 bg-white rounded-xl p-4 border-2 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
            item.isCurrent
              ? 'border-master-turquoise shadow-lg ring-2 ring-master-turquoise/20'
              : item.isCompleted
              ? 'border-gray-200 hover:border-master-turquoise/30'
              : 'border-gray-300 hover:border-master-turquoise'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getLessonIcon(item.lessonType || '', 'text-2xl')}
              <h5 className={`font-semibold ${
                item.isCurrent ? 'text-master-turquoise' : 'text-gray-800'
              }`}>
                {item.title}
              </h5>
            </div>
            
            {/* Badge de réussite */}
            {badge && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                badge.label === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                badge.label === 'Silver' ? 'bg-gray-100 text-gray-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {badge.emoji} {badge.label}
              </div>
            )}
          </div>

          {/* Indicateurs de progression */}
          <div className="space-y-2">
            {/* Barre de progression vidéo */}
            {item.lessonType === 'VIDEO_COURS' && item.progress > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-semibold text-master-turquoise">{Math.round(item.progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-master-turquoise to-cyan-500 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Score QCM */}
            {item.quizScore !== null && (
              <div className="flex items-center gap-2 text-xs">
                <Award className="w-3 h-3 text-master-turquoise" />
                <span className="text-gray-600">Score:</span>
                <span className="font-bold text-master-turquoise">{item.quizScore}%</span>
              </div>
            )}

            {/* Temps estimé si non commencé */}
            {!item.isCompleted && item.progress === 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{item.estimatedTime}</span>
              </div>
            )}

            {/* Indicateur de complétion */}
            {item.isCompleted && (
              <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Leçon terminée</span>
              </div>
            )}

            {/* Indicateur leçon actuelle */}
            {item.isCurrent && !item.isCompleted && (
              <div className="flex items-center gap-2 text-xs text-master-turquoise font-medium">
                <Play className="w-3 h-3" />
                <span>En cours...</span>
              </div>
            )}

            {/* Exercices liés */}
            {item.exercises && item.exercises.length > 0 && (
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                📝 {item.exercises.length} exercice{item.exercises.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  )
}

// ==================== HELPER FUNCTIONS DE CALCUL ====================

function calculateGlobalProgress(items: TimelineItem[]): number {
  const lessons = items.filter(item => item.type === 'lesson')
  if (lessons.length === 0) return 0
  
  const completed = lessons.filter(item => item.isCompleted).length
  return Math.round((completed / lessons.length) * 100)
}

function countCompletedItems(items: TimelineItem[]): number {
  return items.filter(item => item.type === 'lesson' && item.isCompleted).length
}

function countTotalLessons(items: TimelineItem[]): number {
  return items.filter(item => item.type === 'lesson').length
}

